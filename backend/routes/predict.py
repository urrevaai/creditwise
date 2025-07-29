from fastapi import APIRouter, UploadFile, File
import pandas as pd
from utils.preprocess import predict_single

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read uploaded CSV into DataFrame
    df = pd.read_csv(file.file)
    results = []
    for _, row in df.iterrows():
        result = predict_single(row.to_dict())
        results.append(result)
    return {"predictions": results}
