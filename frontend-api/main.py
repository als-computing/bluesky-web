import uvicorn

if __name__ == "__main__":
    # Only watch the current directory, not the entire home directory
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=8002, 
        reload=False
    )