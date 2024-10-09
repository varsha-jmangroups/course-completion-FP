import pandas as pd
import random
from datetime import datetime, timedelta

# Read the users and courses CSV files
users_df = pd.read_csv('C:\\Users\\VarshaPriyadarshini\\Desktop\\Final project\\DataEngineering\\data\\raw\\users.csv')
courses_df = pd.read_csv('C:\\Users\\VarshaPriyadarshini\\Desktop\\Final project\\DataEngineering\\data\\raw\\courses.csv')
learning_path=pd.read_csv('C:\\Users\\VarshaPriyadarshini\\Desktop\\Final project\\DataEngineering\\data\\raw\\learning_path.csv')

# Helper function to generate random enrollment and completion data
def generate_enrollment_data(users, courses, num_records=5001):
    enrollments = []
    certificates = []
    enrolled_pairs = set()  # Set to store (userId, courseId) pairs to ensure uniqueness

    record_id = 1  # Initialize enrollment record ID

    while len(enrollments) < num_records:
        user = random.choice(users)
        course = random.choice(courses)
        enrollment_pair = (user["id"], course["id"])

        # Ensure the (userId, courseId) combination is unique
        if enrollment_pair in enrolled_pairs:
            continue  # Skip if this pair already exists

        enrolled_pairs.add(enrollment_pair)  # Add the pair to the set to track uniqueness

        enrollment_date = datetime.now() - timedelta(days=random.randint(30, 365))  # Random date within last year
        completion_percentage = random.randint(0, 100)

        # Generate enrollment record
        enrollments.append({
            "id": record_id,
            "userId": user["id"],
            "courseId": course["id"],
            "enrollmentDate": enrollment_date.strftime('%Y-%m-%d'),
            "completionPercentage": completion_percentage,
            "completionDate": (enrollment_date + timedelta(days=random.randint(30, 100))).strftime('%Y-%m-%d') if completion_percentage == 100 else None
        })

        # If the course is completed, generate a certificate record
        if completion_percentage == 100:
            certificates.append({
                "id": len(certificates) + 1,
                "userId": user["id"],
                "courseId": course["id"],
                "certificateUrl": f"http://example.com/certificates/{len(certificates) + 1}",
                "issuedAt": (enrollment_date + timedelta(days=random.randint(30, 100))).strftime('%Y-%m-%d')
            })

        record_id += 1  # Increment record ID for the next enrollment

    return enrollments, certificates

# Convert DataFrame to dictionaries for easier random access
users_list = users_df.to_dict(orient='records')
courses_list = courses_df.to_dict(orient='records')

# Generate 100 unique enrollment records and corresponding certificates
enrollments, certificates = generate_enrollment_data(users_list, courses_list, num_records=5001)

# Save enrollments to CSV
enrollments_df = pd.DataFrame(enrollments)
enrollments_df.to_csv('C:\\Users\\VarshaPriyadarshini\\Desktop\\Final project\\DataEngineering\\data\\raw\\enrollments.csv', index=False)

# # Save certificates to CSV
certificates_df = pd.DataFrame(certificates)
certificates_df.to_csv('C:\\Users\\VarshaPriyadarshini\\Desktop\\Final project\\DataEngineering\\data\\raw\\certificates.csv', index=False)

print("Enrollments and Certificates CSV files generated successfully!")
