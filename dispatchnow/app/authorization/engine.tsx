import { createSupabaseServerClient } from "@/lib/supabase/server-client";
export enum UserTier {
    TIER3 = 3,
    TIER2 = 2,
    TIER1 = 1
}

export enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DENIED = "DENIED",
    CANCELLED = "CANCELLED"
}

export interface ApprovalResponse {
    approved: boolean;
    message: string;
    request?: Request;
    error?: string;
}

export interface AuthorizationCheck {
    isAuthorized: boolean;
    reason?: string;
}

export class AuthorizationEngine {
    private supabase;

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    static async create(): Promise<AuthorizationEngine> {
        const supabase = await createSupabaseServerClient();
        return new AuthorizationEngine(supabase);
    }

    async canReviewRequests(userId: string): Promise<boolean> {
        const { data, error } = await this.supabase
            .from('user_profiles')
            .select('tier')
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error(`Failed to fetch user: ${error.message}`);
        }

        return data.tier === UserTier.TIER3;
    }

    async checkReviewAuthorization(reviewerId: string, requestId: string): Promise<AuthorizationCheck> {
        const hasRole = await this.canReviewRequests(reviewerId);
        if (!hasRole) {
            return {
            isAuthorized: false,
            reason: 'User does not have authorization permissions'
            };
        }
        const { data, error } = await this.supabase
            .from('requests')
            .select('status')
            .eq('id', requestId)
            .single();

        if (error) {
            return {
                isAuthorized: false,
                reason: `Failed to fetch request: ${error.message}`
            };
        }

        if (data.status !== RequestStatus.PENDING) {
            return {
                isAuthorized: false,
                reason: 'Request is not in a pending state'
            };
        }
        return { isAuthorized: true };
    }

    async approveRequest(reviewerId: string, requestId: string): Promise<ApprovalResponse> {
        const authCheck = await this.checkReviewAuthorization(reviewerId, requestId);

        if (!authCheck.isAuthorized) {
            return {
                approved: false,
                message: authCheck.reason || 'Not authorized to approve request',
                error: 'AUTHORIZATION_FAILED'
            };
        }

        const {data, error} = await this.supabase
        .from('requests')
        .update({
            status: RequestStatus.APPROVED,
            reviewed_at: new Date().toISOString(),
            reviewed_by: reviewerId,
        })
        .eq('id', requestId)
        .select()
        .single();

        if (error) {
            return {
                approved: false,
                message: 'Failed to approve request',
                error: error.message
            };
        }
        
        return {
            approved: true,
            message: 'Request approved successfully',
            request: data
        };
    }

    async denyRequest(reviewerId: string, requestId: string, reason: string): Promise<ApprovalResponse> {
        if (!reason || reason.trim().length === 0) {
            return {
                approved: false,
                message: 'Denial reason must be provided',
                error: 'MISSING_REASON'
            };
        }

        const authCheck = await this.checkReviewAuthorization(reviewerId, requestId);

        if (!authCheck.isAuthorized) {
            return {
                approved: false,
                message: authCheck.reason || 'Not authorized to deny request',
                error: 'AUTHORIZATION_FAILED'
            };
        }

        const {data, error} = await this.supabase
        .from('requests')
        .update({
            status: RequestStatus.DENIED,
            reviewed_at: new Date().toISOString(),
            reviewed_by: reviewerId,
            denial_reason: reason,
            updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

        if (error) {
            return {
                approved: false,
                message: 'Failed to deny request',
                error: error.message
            };
        }

        return {
            approved: true,
            message: 'Request denied successfully',
            request: data
        };
    }

    async getRequest(requestId: string): Promise<Request | null> {
        const { data, error } = await this.supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw new Error(`Failed to fetch request: ${error.message}`);
        }
        return data;
    }

}