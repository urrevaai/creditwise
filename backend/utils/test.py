# Save this as backend/utils/test_predict.py
from preprocess import predict_single

# Example data (fill with real values from your dataset)
sample = {
    'LIMIT_BAL': 20000,
    'SEX': 2,
    'EDUCATION': 2,
    'MARRIAGE': 1,
    'AGE': 24,
    'PAY_0': 2,
    'PAY_2': 2,
    'PAY_3': -1,
    'PAY_4': -1,
    'PAY_5': -2,
    'PAY_6': -2,
    'BILL_AMT1': 3913,
    'BILL_AMT2': 3102,
    'BILL_AMT3': 689,
    'BILL_AMT4': 0,
    'BILL_AMT5': 0,
    'BILL_AMT6': 0,
    'PAY_AMT1': 0,
    'PAY_AMT2': 689,
    'PAY_AMT3': 0,
    'PAY_AMT4': 0,
    'PAY_AMT5': 0,
    'PAY_AMT6': 0
}

result = predict_single(sample)
print(result)