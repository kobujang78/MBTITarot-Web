import { supabase } from './supabase';
import { UserProfile, CRYSTALS_CONFIG } from '../types';

/**
 * Check if a nickname already exists in the 'profiles' table
 */
export const checkNicknameExists = async (nickname: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .maybeSingle();

    if (error) {
        console.error("Error checking nickname:", error);
        return false;
    }
    return !!data;
};

/**
 * Get user profile from Supabase
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

    if (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }

    if (data) {
        // Map snake_case to camelCase
        return {
            uid: data.id,
            email: data.email,
            nickname: data.nickname,
            mbti: data.mbti,
            crystals: data.crystals || 0,
            referredBy: data.referred_by,
            lastLoginDate: data.last_login_date,
            createdAt: new Date(data.created_at).getTime(),
            totalCount: data.total_count
        } as UserProfile;
    }
    return null;
};

/**
 * Register a new user with initial rewards and referral logic
 */
export const registerUser = async (
    uid: string,
    email: string,
    nickname: string,
    mbti: string,
    referrerNickname?: string
) => {
    let initialCrystals = CRYSTALS_CONFIG.INITIAL;
    let referrerUid = null;

    // 1. Try to find and reward referrer separately
    if (referrerNickname) {
        try {
            const { data: referrerData } = await supabase
                .from('profiles')
                .select('id')
                .eq('nickname', referrerNickname)
                .maybeSingle();

            if (referrerData) {
                referrerUid = referrerData.id;
                initialCrystals += CRYSTALS_CONFIG.REFERRAL_REWARD;

                // Reward the referrer
                const { error: rewardError } = await supabase.rpc('increment_crystals', {
                    user_id: referrerUid,
                    amount: CRYSTALS_CONFIG.REFERRAL_REWARD
                });

                if (rewardError) {
                    console.warn("Could not reward referrer, but proceeding:", rewardError);
                }
            }
        } catch (err) {
            console.error("Referrer lookup failed:", err);
        }
    }

    // 2. Create the new user profile
    const newUser = {
        id: uid,
        email,
        nickname,
        mbti,
        crystals: initialCrystals,
        referred_by: referrerNickname || null,
        last_login_date: new Date().toISOString().split('T')[0],
        total_count: 1
    };

    const { error } = await supabase
        .from('profiles')
        .insert(newUser);

    if (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

/**
 * Handle Daily Login Reward
 */
export const handleDailyLoginReward = async (uid: string): Promise<boolean> => {
    const today = new Date().toISOString().split('T')[0];

    // Check if already claimed today
    const { data: profile } = await supabase
        .from('profiles')
        .select('last_login_date')
        .eq('id', uid)
        .single();

    if (profile && profile.last_login_date !== today) {
        const { error } = await supabase
            .from('profiles')
            .update({
                crystals: supabase.rpc('increment', { row_id: uid, column_name: 'crystals', amount: CRYSTALS_CONFIG.DAILY_LOGIN }),
                last_login_date: today
            })
            .eq('id', uid);

        // Use a simpler approach if RPC is not preferred for single update
        const { error: updateError } = await supabase.rpc('handle_daily_login', {
            profile_id: uid,
            today_date: today,
            reward_amount: CRYSTALS_CONFIG.DAILY_LOGIN
        });

        return !updateError;
    }
    return false;
};

/**
 * Deduct crystals from user's account
 */
export const deductCrystal = async (uid: string, amount: number = 1): Promise<{ success: boolean; message?: string }> => {
    const { data, error } = await supabase.rpc('deduct_crystals', {
        user_id: uid,
        amount: amount
    });

    if (error) {
        console.error("Deduction failed (RPC Error):", error);
        return { success: false, message: error.message };
    }

    // RPC returns boolean (true = success, false = insufficient funds/user not found)
    if (data === false) {
        console.warn("Deduction failed (Logic): Insufficient funds or user not found");
        return { success: false, message: "수정구슬이 부족하거나 사용자를 찾을 수 없습니다." };
    }

    return { success: true };
};

/**
 * Increment total visit count for the user
 */
export const incrementVisitCount = async (uid: string) => {
    const { error } = await supabase.rpc('increment_visit_count', {
        user_id: uid
    });

    if (error) {
        console.error("Increment visit count failed:", error);
    }
};

/**
 * Update User Profile Information
 */
export const updateUserProfile = async (
    uid: string,
    data: { nickname?: string, mbti?: string }
): Promise<void> => {
    const updateData: any = {};
    if (data.nickname) updateData.nickname = data.nickname;
    if (data.mbti) updateData.mbti = data.mbti;

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', uid);

    if (error) {
        console.error("Update profile failed:", error);
        throw error;
    }
};
