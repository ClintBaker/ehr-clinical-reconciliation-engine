from fastapi import APIRouter, Depends

from backend.auth import verify_api_key
from backend.models.reconciliation import (
    MedicationReconciliationRequest,
    MedicationReconciliationResponse,
)

# Service will be implemented in the AI-layer todo
from backend.services.reconciliation_service import reconcile_medication


router = APIRouter(
    tags=["reconciliation"],
    dependencies=[Depends(verify_api_key)],
)


@router.post(
    "/reconcile/medication",
    response_model=MedicationReconciliationResponse,
)
async def reconcile_medication_endpoint(
    payload: MedicationReconciliationRequest,
) -> MedicationReconciliationResponse:
    return await reconcile_medication(payload)

