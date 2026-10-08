# Vena API Dockerfile
# Serves the FastAPI model inference endpoint

FROM python:3.11-slim

# Install 'uv' for blazing fast package installation
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set the working directory inside the container
WORKDIR /app

# Copy only the dependency files first (Leveraging Docker cache)
COPY pyproject.toml uv.lock ./

# Copy the rest of the application code (src) BEFORE installing
# so that `uv` can find `src/vena/__init__.py` to build the package.
COPY . .

# Install dependencies system-wide (since we are isolated in a container anyway)
RUN uv pip install --system --no-cache -e .

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to run the API using uvicorn
CMD ["uvicorn", "vena.api:app", "--host", "0.0.0.0", "--port", "8000"]
