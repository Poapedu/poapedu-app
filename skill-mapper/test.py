import requests
import pytest

# Define the base URL of the API
BASE_URL = "http://127.0.0.1:8000/" 

def test_process_course():
    # Define the input data
    course_data = {
        "title": "Introduction to Data Science",
        "information": "This course covers the basics of data science, including data manipulation, statistical analysis, and machine learning techniques.",
#        "webhook_url": "http://localhost:8001/webhook/1"
        "webhook_url": "https://webhook-test.com/749919f20e809b4ae5e18dad2f4154d5"
    }

    # Send a POST request to the API
    response = requests.post(f"{BASE_URL}/process-course/", json=course_data)

    # Assert the response status code
    assert response.status_code == 200

    # Assert the response content
    assert response.json() == {"message": "Skills processed and sent to the webhook successfully"}

def test_webhook_receiver():
    # Define the input data
    skills_data = {
        "skills": ["Data Manipulation", "Statistical Analysis", "Machine Learning"]
    }

    # Send a POST request to the webhook receiver
    response = requests.post("https://webhook-test.com/749919f20e809b4ae5e18dad2f4154d5", json=skills_data)

    # Assert the response status code
    assert response.status_code == 200

    # Assert the response content
    assert response.json() == {"message": "Skills updated successfully"}

if __name__ == "__main__":
    # Run the tests
    pytest.main()
