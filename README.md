## MongoDB Atlas Integration (`atlas_int` branch)

This branch introduces a new feature: **saving extracted LinkedIn profile data to the cloud** using MongoDB Atlas. The integration is powered by a Vercel serverless function. The setup steps for this atlas integration is given in [wiki](https://github.com/KartikayKaul/Yale3/wiki/).

### Key Features
- Send extracted profile data from the Chrome extension to a **MongoDB Atlas database**.
- Uses a Vercel serverless endpoint (`/api/save`) to receive and store data securely.
- No local backend needed — the cloud function does all the work.

### Updated Project Structure
- `vercel/` folder created dynamically via shell script.
- `config.json` updated with `MONGO_API_ENDPOINT`.

### How to Use
1. Ensure you’ve created a MongoDB Atlas cluster.
2. Sign up at [vercel.com](https://vercel.com) and link your GitHub account (or any account you have).
3. Run the provided `deploy_vercel_function.sh` script to:
   - Generate the serverless function.
   - Deploy it to Vercel.
   - Automatically update `config.json` with your API endpoint.
4. Choose `save to MongoDB` in your Chrome extension UI.
5. Data will be POSTed to your MongoDB Atlas cluster in real-time.

