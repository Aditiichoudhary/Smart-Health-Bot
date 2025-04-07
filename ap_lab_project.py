# -*- coding: utf-8 -*-
"""AP_Lab_Project.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1qMtO8Dy8nW5UQEgL-MSsBLbtUSOoUyEG
"""

import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
df = pd.read_csv('synthetic_health_dataset.csv')

# Feature selection
X = df[['Age', 'Gender', 'BMI', 'Blood_Pressure', 'Cholesterol', 'Symptom_1', 'Symptom_2', 'Symptom_3', 'Symptom_4']].copy()
y = df['Disease']

# Label Encoding (Using separate encoders for each category)
le_gender = LabelEncoder()
le_bp = LabelEncoder()
le_cholesterol = LabelEncoder()
le_symptom_1 = LabelEncoder()
le_symptom_2 = LabelEncoder()
le_symptom_3 = LabelEncoder()
le_symptom_4 = LabelEncoder()
le_disease = LabelEncoder()

X.loc[:, 'Gender'] = le_gender.fit_transform(X['Gender'])
X.loc[:, 'Blood_Pressure'] = le_bp.fit_transform(X['Blood_Pressure'])
X.loc[:, 'Cholesterol'] = le_cholesterol.fit_transform(X['Cholesterol'])
X.loc[:, 'Symptom_1'] = le_symptom_1.fit_transform(X['Symptom_1'])
X.loc[:, 'Symptom_2'] = le_symptom_2.fit_transform(X['Symptom_2'])
X.loc[:, 'Symptom_3'] = le_symptom_3.fit_transform(X['Symptom_3'])
X.loc[:, 'Symptom_4'] = le_symptom_4.fit_transform(X['Symptom_4'])
y_encoded = le_disease.fit_transform(y)

# Try to load pre-saved train and test data
try:
    with open('train.pkl', 'rb') as train_file:
        X_train, y_train = pickle.load(train_file)
    with open('test.pkl', 'rb') as test_file:
        X_test, y_test = pickle.load(test_file)
    print("Train and Test data loaded successfully from pickle files!")

except FileNotFoundError:
    print("Pickle files not found. Splitting data and saving for future use...")
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    with open('train.pkl', 'wb') as train_file:
        pickle.dump((X_train, y_train), train_file)
    with open('test.pkl', 'wb') as test_file:
        pickle.dump((X_test, y_test), test_file)

    print("Train and Test data saved as train.pkl and test.pkl!")

# Model training with hyperparameter tuning
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 5, 10],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 5, 10]
}

grid_search = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_

# Model evaluation
y_pred = best_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f'Model Accuracy: {accuracy * 100:.2f}%')
print('Classification Report:\n', classification_report(y_test, y_pred))

# Function to clean input data
def clean_input(value, category):
    """
    Cleans and standardizes user input.
    - Converts gender (m -> Male, f -> Female)
    - Converts blood pressure and cholesterol to proper format (l -> Low, n -> Normal, h -> High)
    - Converts 'na' to 'No_symptom'
    - Capitalizes first letter of symptoms
    """
    value = value.strip().lower()

    if category == "gender":
        return "Male" if value == "m" else "Female" if value == "f" else value
    elif category == "bp":
        return "Low" if value == "l" else "Normal" if value == "n" else "High" if value == "h" else value
    elif category == "cholesterol":
        return "Normal" if value == "n" else "High" if value == "h" else value
    elif category == "symptom":
        return "No_symptom" if value == "na" else value.capitalize()
    else:
        return value

# Disease prediction function (Updated with separate encoders)
def predict_disease(name, age, gender, bmi, blood_pressure, cholesterol, symptom_1, symptom_2, symptom_3, symptom_4):
    # Clean user input
    gender = clean_input(gender, "gender")
    blood_pressure = clean_input(blood_pressure, "bp")
    cholesterol = clean_input(cholesterol, "cholesterol")
    symptom_1 = clean_input(symptom_1, "symptom")
    symptom_2 = clean_input(symptom_2, "symptom")
    symptom_3 = clean_input(symptom_3, "symptom")
    symptom_4 = clean_input(symptom_4, "symptom")

    # Encode categorical values
    gender_encoded = le_gender.transform([gender])[0]
    bp_encoded = le_bp.transform([blood_pressure])[0]
    cholesterol_encoded = le_cholesterol.transform([cholesterol])[0]
    symptom_1_encoded = le_symptom_1.transform([symptom_1])[0]
    symptom_2_encoded = le_symptom_2.transform([symptom_2])[0]
    symptom_3_encoded = le_symptom_3.transform([symptom_3])[0]
    symptom_4_encoded = le_symptom_4.transform([symptom_4])[0]

    input_data = np.array([age, gender_encoded, bmi, bp_encoded, cholesterol_encoded,
                           symptom_1_encoded, symptom_2_encoded, symptom_3_encoded, symptom_4_encoded]).reshape(1, -1)

    prediction = best_model.predict(input_data)
    disease_name = le_disease.inverse_transform(prediction)

    print(f"Name: {name}")
    print(f"Predicted Disease: {disease_name[0]}")

# User input for disease prediction
name_input = input("Enter your name: ")
age_input = int(input("Enter your age: "))
gender_input = input("Enter your gender (m -> Male/f -> Female): ")
bmi_input = float(input("Enter your BMI: "))
blood_pressure_input = input("Enter your blood pressure (l -> Low/n -> Normal/h -> High): ")
cholesterol_input = input("Enter your cholesterol level (n -> Normal/h -> High): ")
symptoms_input = [
    input("Enter Symptom 1 (or 'na' if none): "),
    input("Enter Symptom 2 (or 'na' if none): "),
    input("Enter Symptom 3 (or 'na' if none): "),
    input("Enter Symptom 4 (or 'na' if none): ")
]

predict_disease(name_input,
                age_input,
                gender_input,
                bmi_input,
                blood_pressure_input,
                cholesterol_input,
                symptoms_input[0],
                symptoms_input[1],
                symptoms_input[2],
                symptoms_input[3])