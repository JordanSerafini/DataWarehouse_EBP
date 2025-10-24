-- Migration: Populate dim_time dimension table
-- Date: 2025-10-24
-- Description: Populates the time dimension with dates from 2020-01-01 to 2030-12-31

-- Generate dates for 10 years (2020-2030)
INSERT INTO ninjaone.dim_time (
    time_id,
    date,
    year,
    quarter,
    month,
    week,
    day,
    day_of_week,
    day_of_year,
    month_name,
    day_name,
    quarter_name,
    is_weekend,
    is_holiday,
    fiscal_year,
    fiscal_quarter,
    fiscal_month
)
SELECT
    -- time_id format: YYYYMMDD (e.g., 20250124 for January 24, 2025)
    TO_CHAR(d, 'YYYYMMDD')::INTEGER AS time_id,
    d::DATE AS date,
    EXTRACT(YEAR FROM d)::INTEGER AS year,
    EXTRACT(QUARTER FROM d)::INTEGER AS quarter,
    EXTRACT(MONTH FROM d)::INTEGER AS month,
    EXTRACT(WEEK FROM d)::INTEGER AS week,
    EXTRACT(DAY FROM d)::INTEGER AS day,
    EXTRACT(DOW FROM d)::INTEGER AS day_of_week,
    EXTRACT(DOY FROM d)::INTEGER AS day_of_year,
    -- Month names in French
    CASE EXTRACT(MONTH FROM d)
        WHEN 1 THEN 'Janvier'
        WHEN 2 THEN 'Février'
        WHEN 3 THEN 'Mars'
        WHEN 4 THEN 'Avril'
        WHEN 5 THEN 'Mai'
        WHEN 6 THEN 'Juin'
        WHEN 7 THEN 'Juillet'
        WHEN 8 THEN 'Août'
        WHEN 9 THEN 'Septembre'
        WHEN 10 THEN 'Octobre'
        WHEN 11 THEN 'Novembre'
        WHEN 12 THEN 'Décembre'
    END AS month_name,
    -- Day names in French
    CASE EXTRACT(DOW FROM d)
        WHEN 0 THEN 'Dimanche'
        WHEN 1 THEN 'Lundi'
        WHEN 2 THEN 'Mardi'
        WHEN 3 THEN 'Mercredi'
        WHEN 4 THEN 'Jeudi'
        WHEN 5 THEN 'Vendredi'
        WHEN 6 THEN 'Samedi'
    END AS day_name,
    'T' || EXTRACT(QUARTER FROM d) AS quarter_name,
    -- Weekend: Saturday (6) or Sunday (0)
    EXTRACT(DOW FROM d) IN (0, 6) AS is_weekend,
    FALSE AS is_holiday,  -- Can be updated manually for French holidays
    -- Fiscal year (assuming calendar year = fiscal year)
    EXTRACT(YEAR FROM d)::INTEGER AS fiscal_year,
    EXTRACT(QUARTER FROM d)::INTEGER AS fiscal_quarter,
    EXTRACT(MONTH FROM d)::INTEGER AS fiscal_month
FROM generate_series(
    '2020-01-01'::DATE,
    '2030-12-31'::DATE,
    '1 day'::INTERVAL
) AS d
ON CONFLICT (time_id) DO NOTHING;

-- Verify the insertion
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM ninjaone.dim_time;
    RAISE NOTICE 'dim_time populated with % rows', row_count;
END $$;
