# YoloHome - Backend

To run the backend server, follow these steps:
1. **Install Dependencies**: Make sure you have Python installed. Then, install the required packages using pip:

   ```bash
   pip install -r requirements.txt
   ```
2. **Set Environment Variables**: Create a `.env` file in the root directory of the project and copy the keys from `.env.example` into it. 
   ```
   ADAFRUIT_AIO_USERNAME=your_username
   ADAFRUIT_AIO_KEY=your_key
   ```
3. **Run the Server**: Start the FastAPI server using Uvicorn:

   ```bash
   uvicorn app:app --reload
   ```