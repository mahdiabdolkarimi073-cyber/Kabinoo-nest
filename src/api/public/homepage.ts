import RequestHandler from "@/core/request.handler";

export const homepageDefaults = [
    {
        key: "announcement",
        title: "اطلاعیه کابینو",
        subtitle: "ثبت سفارش و مشاوره طراحی",
        description: "برای دریافت مشاوره رایگان و اطلاع از شرایط سفارش با ما در ارتباط باشید.",
        image: "",
        buttonLabel: "دریافت مشاوره",
        buttonHref: "/counseling",
        sortOrder: -1,
    },
    {
        key: "hero",
        title: "Kabinoo",
        subtitle: "همراه شما هستیم",
        description: "تا فضایی شیک و کاربردی خلق کنیم!",
        image: "/design/sliders/lg-00.jpg",
        buttonLabel: "شروع طراحی",
        buttonHref: "/design",
        sortOrder: 0,
    },
    {
        key: "about",
        title: "کابینو",
        subtitle: "فراتر از طراحی",
        description: "شرکت ما با سال‌ها تجربه در زمینه طراحی و ساخت انواع کابینت، کمد و میز، خدماتی دقیق و ماندگار ارائه می‌دهد.",
        image: "/design/image1.png",
        buttonLabel: "آشنایی بیشتر",
        buttonHref: "/about",
        sortOrder: 1,
    },
    {
        key: "design",
        title: "خودت طراحی کن!",
        subtitle: "قابلیت سفارشی‌سازی سفارش",
        description: "از ایده‌پردازی تا خلق فضای اختصاصی، انتخاب ابعاد و جزئیات را خودتان انجام دهید.",
        image: "/design/sliders/sm-02.jpg",
        buttonLabel: "طراحی کن",
        buttonHref: "/design",
        sortOrder: 2,
    },
    {
        key: "calculator",
        title: "قبل از تصمیم، حسابش کن",
        subtitle: "برآورد هوشمند هزینه",
        description: "با چند انتخاب ساده، یک برآورد اولیه از هزینه کابینت و تجهیزات مورد نیازتان بگیرید.",
        image: "/design/calc-bg.png",
        buttonLabel: "محاسبه قیمت",
        buttonHref: "/calc",
        sortOrder: 3,
    },
    {
        key: "shop",
        title: "برای خانه‌ات انتخاب کن",
        subtitle: "فروشگاه محصولات چوبی",
        description: "مدل‌های آماده را ببینید، مقایسه کنید و برای فضای خودتان سفارش دهید.",
        image: "/design/image2.png",
        buttonLabel: "ورود به فروشگاه",
        buttonHref: "/shop",
        sortOrder: 4,
    },
    {
        key: "counseling",
        title: "یک گفت‌وگوی خوب، شروع یک فضای خوب است",
        subtitle: "مشاوره رایگان طراحی",
        description: "اگر هنوز بین مدل‌ها و متریال‌ها مردد هستید، کارشناسان کابینو کنار شما هستند.",
        image: "/design/sliders/sm-04.jpg",
        buttonLabel: "دریافت مشاوره",
        buttonHref: "/counseling",
        sortOrder: 5,
    },
];

export async function ensureHomepageDefaults() {
    const count = await prisma.homepageContent.count();
    if (count === 0) {
        await prisma.homepageContent.createMany({ data: homepageDefaults });
        return;
    }

    const announcement = homepageDefaults.find(item => item.key === "announcement");
    if (announcement) {
        await prisma.homepageContent.upsert({
            where: { key: announcement.key },
            update: {},
            create: announcement,
        });
    }
}

export default class HomepageHandler extends RequestHandler {
    async GET() {
        await ensureHomepageDefaults();
        return prisma.homepageContent.findMany({
            where: { enabled: true },
            orderBy: { sortOrder: "asc" },
        });
    }
}
