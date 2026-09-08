import os

with open('batch_100.sql', 'r') as f:
    lines = f.readlines()

header = "INSERT INTO public.resources (title, description, type, category, content, creator_id, tags, likes_count, saves_count, created_at) VALUES "
delete = "DELETE FROM public.resources;"

def run_migration(sql):
    # This is a mock function, we will just print for the AI to handle
    pass

print(delete)
for i in range(1, len(lines), 20):
    batch_lines = lines[i:i+20]
    # Remove comma from last line of batch if it's there
    batch_lines[-1] = batch_lines[-1].strip().rstrip(',') + ';'
    print(header)
    print("".join(batch_lines))
