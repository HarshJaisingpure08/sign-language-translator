import csv
from collections import Counter

with open('../data/training_data.csv') as f:
    reader = csv.reader(f)
    header = next(reader)

    labels = []
    for i, row in enumerate(reader, start=2):  # start=2 since row 1 is the header
        if len(row) == 0:
            print(f"WARNING: Row {i} is completely empty - skipping")
            continue
        labels.append(row[0])

counts = Counter(labels)
for label, count in counts.items():
    print(f'{label}: {count} samples')

print(f'\nTotal samples: {len(labels)}')
print(f'Total unique signs: {len(counts)}')