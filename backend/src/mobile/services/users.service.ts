import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserRole } from '../enums/user-role.enum';
import { CreateUserDto, UpdateUserDto } from '../dto/users/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  /**
   * Liste publique des utilisateurs (pour login)
   * Retourne seulement email, nom complet, et rôle
   */
  async getPublicUsersList() {
    const result = await this.db.query(
      `
      SELECT
        email,
        full_name,
        role
      FROM mobile.users
      WHERE is_active = true
      ORDER BY
        CASE role
          WHEN 'super_admin' THEN 1
          WHEN 'admin' THEN 2
          WHEN 'patron' THEN 3
          WHEN 'chef_chantier' THEN 4
          WHEN 'commercial' THEN 5
          WHEN 'technicien' THEN 6
          ELSE 7
        END,
        full_name
      `,
      [],
    );

    return result.rows;
  }

  /**
   * Liste complète des utilisateurs avec pagination et filtres
   */
  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
  }) {
    const { page, limit, search, role } = params;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams: (string | UserRole)[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      whereClause += ` AND role = $${paramIndex}`;
      queryParams.push(role);
      paramIndex++;
    }

    const countResult = await this.db.query(
      `SELECT COUNT(*) as total FROM mobile.users ${whereClause}`,
      queryParams,
    );

    const dataResult = await this.db.query(
      `
      SELECT
        id,
        email,
        full_name,
        role,
        colleague_id,
        is_active,
        is_verified,
        last_login_at,
        created_at,
        updated_at
      FROM mobile.users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      [...queryParams, limit, offset],
    );

    return {
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
      totalPages: Math.ceil(countResult.rows[0].total / limit),
    };
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(id: string) {
    const result = await this.db.query(
      `
      SELECT
        u.id,
        u.email,
        u.full_name,
        u.role,
        u.colleague_id,
        u.is_active,
        u.is_verified,
        u.last_login_at,
        u.last_device_id,
        u.failed_login_attempts,
        u.created_at,
        u.updated_at,
        c."Contact_Name" as colleague_name
      FROM mobile.users u
      LEFT JOIN public."Colleague" c ON c."Id" = u.colleague_id
      WHERE u.id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    return result.rows[0];
  }

  /**
   * Créer un utilisateur
   */
  async createUser(createUserDto: CreateUserDto, createdBy: string) {
    const passwordHash = await bcrypt.hash(
      createUserDto.password || 'pass123',
      10,
    );

    const result = await this.db.query(
      `
      INSERT INTO mobile.users (
        email, password_hash, full_name, role, colleague_id,
        is_active, is_verified, created_by, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, email, full_name, role, colleague_id, is_active, created_at
      `,
      [
        createUserDto.email,
        passwordHash,
        createUserDto.fullName,
        createUserDto.role,
        createUserDto.colleagueId || null,
        createUserDto.isActive !== false,
        createUserDto.isVerified || false,
        createdBy,
      ],
    );

    return result.rows[0];
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto, updatedBy: string) {
    const updates: string[] = [];
    const values: (string | UserRole | boolean)[] = [];
    let paramIndex = 1;

    if (updateUserDto.email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      values.push(updateUserDto.email);
    }

    if (updateUserDto.fullName !== undefined) {
      updates.push(`full_name = $${paramIndex++}`);
      values.push(updateUserDto.fullName);
    }

    if (updateUserDto.role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      values.push(updateUserDto.role);
    }

    if (updateUserDto.colleagueId !== undefined) {
      updates.push(`colleague_id = $${paramIndex++}`);
      values.push(updateUserDto.colleagueId);
    }

    if (updateUserDto.isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(updateUserDto.isActive);
    }

    if (updateUserDto.isVerified !== undefined) {
      updates.push(`is_verified = $${paramIndex++}`);
      values.push(updateUserDto.isVerified);
    }

    if (updates.length === 0) {
      return this.getUserById(id);
    }

    updates.push(`updated_by = $${paramIndex++}`, `updated_at = NOW()`);
    values.push(updatedBy);

    values.push(id);

    const result = await this.db.query(
      `
      UPDATE mobile.users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, full_name, role, colleague_id, is_active, updated_at
      `,
      values,
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    return result.rows[0];
  }

  /**
   * Supprimer un utilisateur (soft delete)
   */
  async deleteUser(id: string) {
    const result = await this.db.query(
      `
      UPDATE mobile.users
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(id: string) {
    const passwordHash = await bcrypt.hash('pass123', 10);

    const result = await this.db.query(
      `
      UPDATE mobile.users
      SET
        password_hash = $1,
        failed_login_attempts = 0,
        locked_until = NULL,
        updated_at = NOW()
      WHERE id = $2
      RETURNING id, email
      `,
      [passwordHash, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    return {
      message: 'Mot de passe réinitialisé à "pass123"',
      user: result.rows[0],
    };
  }

  /**
   * Synchroniser les collègues EBP
   */
  async syncColleagues() {
    const result = await this.db.query(
      `SELECT * FROM mobile.sync_all_pending_colleagues()`,
      [],
    );

    return {
      message: 'Synchronisation terminée',
      synced: result.rows[0].synced_count,
      skipped: result.rows[0].skipped_count,
      details: result.rows[0].details,
    };
  }
}
