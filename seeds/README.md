# Database Seed & Migration Files

This directory contains database seeding resources, SQL scripts, and utility scripts for the Promptly database.

## Directory Structure

- **`*.sql`**: Main SQL seed definitions and migration batches (`seed.sql`, `final_seed_v5.sql`, `seed_resources_v3.sql`, etc.).
- **`chunks/`**: Split seed parts (`seed_part_*`, `seed_chunk_*`) used for batch chunked imports.
- **`scripts/`**: Utility scripts to generate, split, test, and run database seeds (`generate_seed.py`, `run_seed.py`, `test-db.js`, etc.).
