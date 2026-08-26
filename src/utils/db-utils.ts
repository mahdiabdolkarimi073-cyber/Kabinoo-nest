declare global {
    interface Function {
        secure?: boolean;
        callable?: boolean;
    }
}

export function dbSecureProp<T extends Function>(func: T): T {
    func.secure = true;
    return func;
}

export function Callable<T extends Function>(func: T): T {
    func.callable = true;
    return func;
}

export async function grantReferralReward(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refId) return;

    const referrer = await prisma.user.findFirst({
        where: { refCode: user.refId },
    });
    if (!referrer) return;

    const rewardAmount = await prisma.variable.findUnique({
        where: { key: "REFERRAL_REWARD" },
    });
    const amount = rewardAmount?.value || 0;
    if (amount <= 0) return;

    const rewardTypeRow = await prisma.variable.findUnique({
        where: { key: "REFERRAL_REWARD_TYPE" },
    });
    const rewardType = rewardTypeRow?.value || 0;

    if (rewardType === 0) {
        const existing = await prisma.offCode.findFirst({
            where: { userId: referrer.id, id: { startsWith: "ref_" + user.id } },
        });
        if (existing) return;

        const codeId = "ref_" + user.id + "_" + Date.now();
        await prisma.offCode.create({
            data: {
                id: codeId,
                userId: referrer.id,
                type: "FIXED",
                amount: amount,
                percent: 0,
                cashOnly: false,
                maxUsage: 1,
                used: 0,
            },
        });
    } else {
        await prisma.user.update({
            where: { id: referrer.id },
            data: { wallet: { increment: amount } },
        });
    }
}