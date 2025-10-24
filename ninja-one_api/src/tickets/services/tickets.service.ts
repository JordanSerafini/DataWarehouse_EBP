import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NinjaOneAuthService } from '../../common';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly authService: NinjaOneAuthService,
  ) {}

  async getTickets(filters?: {
    pageSize?: number;
    lastCursorId?: number;
  }): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      const boardId = 2;
      const pageSize = filters?.pageSize || 1000;
      const lastCursorId = filters?.lastCursorId || 0;

      const url = `${this.authService.baseUrl}/v2/ticketing/trigger/board/${boardId}/run`;
      this.logger.log(
        `Fetching tickets from NinjaOne API (board ${boardId})...`,
      );

      const requestBody = {
        sortBy: [
          {
            field: 'lastUpdated',
            direction: 'DESC',
          },
        ],
        pageSize: pageSize,
        lastCursorId: lastCursorId,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );

      let tickets: any[] = [];
      if (Array.isArray(response.data)) {
        tickets = response.data;
      } else if (
        response.data?.results &&
        Array.isArray(response.data.results)
      ) {
        tickets = response.data.results;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        tickets = response.data.data;
      }

      this.logger.log(`Retrieved ${tickets.length} tickets`);
      return tickets;
    } catch (error) {
      this.logger.error('Failed to fetch tickets:', error.message);
      throw new Error('Failed to fetch tickets from NinjaOne API');
    }
  }

  async getTicketById(ticketId: number): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log(`Fetching ticket ${ticketId} from NinjaOne API...`);

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/ticketing/ticket/${ticketId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch ticket ${ticketId}:`,
        error.response?.data || error.message,
      );
      throw new Error(`Failed to fetch ticket ${ticketId} from NinjaOne API`);
    }
  }

  async getTicketBoards(): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log('Fetching ticket boards from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.authService.baseUrl}/v2/ticketing/ticket-board-group`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      this.logger.log(`Retrieved ${response.data?.length || 0} ticket boards`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch ticket boards:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch ticket boards from NinjaOne API');
    }
  }

  async getTicketStatuses(): Promise<any> {
    const token = await this.authService.authenticate();

    try {
      this.logger.log('Fetching ticket statuses from NinjaOne API...');

      const response = await firstValueFrom(
        this.httpService.get(`${this.authService.baseUrl}/v2/ticketing/ticket-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }),
      );

      this.logger.log(
        `Retrieved ${response.data?.length || 0} ticket statuses`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to fetch ticket statuses:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to fetch ticket statuses from NinjaOne API');
    }
  }
}
