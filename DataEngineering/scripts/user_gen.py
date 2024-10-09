import random
import faker
from bcrypt import hashpw, gensalt
import pandas as pd

# Initialize Faker for generating fake names and emails
fake = faker.Faker()

# Define the roles and initialize the list to store the generated data
roles = ['Employee', 'Admin']
data = []

# Function to generate a hashed password
def generate_password():
    password = "password123"  # Static password for hashing (replace with random if needed)
    hashed = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')
    return hashed

# Generate fake data
for i in range(1, 501):  # Generate 10 rows of data
    name = fake.name()
    email = fake.email()
    password = "$2a$10$YvZWEO2jzLiAZdTu0hAPxefD5src/cXhbBF9Gia7Llf61aWnCXSfm"
    role = random.choice(roles)
    data.append([i, name, email, password, role])

# Convert to a DataFrame
df = pd.DataFrame(data, columns=["id", "name", "email", "password", "role"])

# Save the data to CSV
df.to_csv('fake_user_data.csv', index=False)

print(df.head())
