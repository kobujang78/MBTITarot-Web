import { db } from './firebase';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    runTransaction,
    increment,
    serverTimestamp
} from 'firebase/firestore';
import { UserProfile, CRYSTALS_CONFIG } from '../types';

/**
 * Check if a nickname already exists in the 'users' collection
 */
export const checkNicknameExists = async (nickname: string): Promise<boolean> => {
    const q = query(collection(db, 'users'), where('nickname', '==', nickname));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const data = userSnap.data() as any;
        const crystals = data.crystals || 0;
        return { ...data, crystals } as UserProfile;
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
    const userRef = doc(db, 'users', uid);
    let initialCrystals = CRYSTALS_CONFIG.INITIAL;
    let referrerUid = '';

    // 1. Try to find and reward referrer separately
    if (referrerNickname) {
        try {
            const q = query(collection(db, 'users'), where('nickname', '==', referrerNickname));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const referrerDoc = querySnapshot.docs[0];
                referrerUid = referrerDoc.id;

                // If we found a valid referrer, the NEW user gets the reward
                initialCrystals += CRYSTALS_CONFIG.REFERRAL_REWARD;

                // Attempt to reward the referrer - this might fail due to security rules
                // but we wrap it in try-catch so it doesn't block registration
                try {
                    await updateDoc(doc(db, 'users', referrerUid), {
                        crystals: increment(CRYSTALS_CONFIG.REFERRAL_REWARD)
                    });
                } catch (err) {
                    console.warn("Could not reward referrer due to permissions, but proceeding with registration:", err);
                }
            }
        } catch (err) {
            console.error("Referrer lookup failed:", err);
        }
    }

    // 2. Create the new user - this is the critical part
    const newUser: UserProfile = {
        uid,
        email,
        nickname,
        mbti,
        crystals: initialCrystals,
        referredBy: referrerNickname || undefined,
        lastLoginDate: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
        totalCount: 1
    };

    await setDoc(userRef, newUser);
};

/**
 * Handle Daily Login Reward
 * Returns true if reward was given, false otherwise
 */
export const handleDailyLoginReward = async (uid: string): Promise<boolean> => {
    const userRef = doc(db, 'users', uid);
    const today = new Date().toISOString().split('T')[0];

    return await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) return false;

        const userData = userSnap.data() as UserProfile;
        if (userData.lastLoginDate !== today) {
            transaction.update(userRef, {
                crystals: increment(CRYSTALS_CONFIG.DAILY_LOGIN),
                lastLoginDate: today
            });
            return true; // Reward given
        }
        return false; // Already claimed today
    });
};

/**
 * Deduct a crystal from user's account
 */
export const deductCrystal = async (uid: string, amount: number = 1): Promise<boolean> => {
    const userRef = doc(db, 'users', uid);

    try {
        await runTransaction(db, async (transaction) => {
            const userSnap = await transaction.get(userRef);
            if (!userSnap.exists()) throw new Error("User does not exist");

            const userData = userSnap.data() as any;
            const currentCrystals = userData.crystals || 0;

            if (currentCrystals < amount) {
                throw new Error("Insufficient crystals");
            }

            transaction.update(userRef, {
                crystals: increment(-amount)
            });
        });
        return true;
    } catch (error) {
        console.error("Deduction failed:", error);
        return false;
    }
};
/**
 * Increment total visit count for the user
 */
export const incrementVisitCount = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    try {
        await updateDoc(userRef, {
            totalCount: increment(1)
        });
    } catch (error) {
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
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
};
