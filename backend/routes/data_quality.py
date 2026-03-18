from fastapi import APIRouter, Depends

from backend.auth import verify_api_key
from backend.models.data_quality import DataQualityInput, DataQualityResponse

# Service will be implemented in the AI-layer todo
from backend.services.data_quality_service import assess_data_quality


router = APIRouter(
    tags=["data-quality"],
    dependencies=[Depends(verify_api_key)],
)


@router.post(
    "/validate/data-quality",
    response_model=DataQualityResponse,
)
async def validate_data_quality_endpoint(
    payload: DataQualityInput,
) -> DataQualityResponse:
    return await assess_data_quality(payload)

