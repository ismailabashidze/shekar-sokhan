export interface ZoneConfig {
	name: string;
	path: string;
	icon: string;
	label: string;
	color?: string;
	sidebarItems?: SidebarItem[];
	horizontalNavItems?: HorizontalNavItem[];
}

export interface SidebarItem {
	to: string;
	label: string;
	icon: string;
	badge?: string | number;
	children?: SidebarItem[];
}

export interface HorizontalNavItem {
	to: string;
	label: string;
	icon?: string;
	badge?: string | number;
}

export const ZONE_CONFIGS: Record<string, ZoneConfig> = {
	'admin': {
		name: 'admin',
		path: '/admin',
		icon: 'ph:shield-check',
		label: 'مدیریت',
		color: 'red',
		sidebarItems: [
			{
				to: '/admin',
				label: 'پیشخوان',
				icon: 'ph:house',
			},
			{
				to: '/admin/users',
				label: 'کاربران',
				icon: 'ph:users',
			},
			{
				to: '/admin/notifications',
				label: 'اعلان‌ها',
				icon: 'ph:bell',
			},
			{
				to: '/admin/campaigns',
				label: 'کمپین‌ها',
				icon: 'ph:megaphone',
			},
			{
				to: '/admin/feedbacks',
				label: 'بازخوردها',
				icon: 'ph:chat-circle',
			},
			{
				to: '/admin/session-dashboard',
				label: 'داشبورد جلسات',
				icon: 'ph:calendar',
			},
			{
				to: '/admin/monitoring',
				label: 'مانیتورینگ',
				icon: 'ph:monitor',
			},
		],
		horizontalNavItems: [
			{
				to: '/admin',
				label: 'پیشخوان',
				icon: 'ph:house',
			},
			{
				to: '/admin/users',
				label: 'کاربران',
			},
			{
				to: '/admin/notifications',
				label: 'اعلان‌ها',
			},
			{
				to: '/admin/campaigns',
				label: 'کمپین‌ها',
			},
		],
	},
	'hamdel': {
		name: 'hamdel',
		path: '/hamdel',
		icon: 'ph:heart',
		label: 'هم‌دل',
		color: 'pink',
		sidebarItems: [
			{
				to: '/hamdel/sessions',
				label: 'گفتگو',
				icon: 'ph:chats',
			},
			{
				to: '/deeds/start',
				label: 'کارهای‌ نیک',
				icon: 'ph:hands-praying',
			},
			{
				to: '/report',
				label: 'گزارش‌',
				icon: 'ph:file-text',
			},
		],
		horizontalNavItems: [
			{
				to: '/hamdel',
				label: 'داشبورد',
			},
			{
				to: '/hamdel/patients',
				label: 'بیماران',
			},
			{
				to: '/hamdel/sessions',
				label: 'جلسات',
			},
		],
	},
	'darmana': {
		name: 'darmana',
		path: '/darmana',
		icon: 'ph:first-aid-kit',
		label: 'درمانا',
		color: 'green',
		sidebarItems: [
			{
				to: '/darmana',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/darmana/patients',
				label: 'بیماران',
				icon: 'ph:users',
				children: [
					{
						to: '/darmana/patients',
						label: 'لیست بیماران',
						icon: 'ph:list',
					},
					{
						to: '/darmana/patients/new',
						label: 'بیمار جدید',
						icon: 'ph:plus',
					},
				],
			},
			{
				to: '/darmana/therapists',
				label: 'درمانگران',
				icon: 'ph:user-gear',
				children: [
					{
						to: '/darmana/therapists',
						label: 'لیست درمانگران',
						icon: 'ph:list',
					},
					{
						to: '/darmana/therapists/new',
						label: 'درمانگر جدید',
						icon: 'ph:plus',
					},
					{
						to: '/darmana/therapists/ai',
						label: 'درمانگر هوشمند',
						icon: 'ph:robot',
					},
				],
			},
			{
				to: '/darmana/sessions',
				label: 'جلسات درمانی',
				icon: 'ph:calendar',
			},
			{
				to: '/darmana/discount',
				label: 'تخفیف‌ها',
				icon: 'ph:tag',
			},
		],
		horizontalNavItems: [
			{
				to: '/darmana',
				label: 'داشبورد',
			},
			{
				to: '/darmana/patients',
				label: 'بیماران',
			},
			{
				to: '/darmana/therapists',
				label: 'درمانگران',
			},
			{
				to: '/darmana/sessions',
				label: 'جلسات',
			},
		],
	},
	'clinic': {
		name: 'clinic',
		path: '/clinic',
		icon: 'ph:hospital',
		label: 'کلینیک',
		color: 'blue',
		sidebarItems: [
			{
				to: '/clinic',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/clinic/schedule',
				label: 'وقت‌دهی',
				icon: 'ph:calendar',
			},
			{
				to: '/clinic/therapists',
				label: 'درمانگران',
				icon: 'ph:user-gear',
			},
		],
		horizontalNavItems: [
			{
				to: '/clinic',
				label: 'داشبورد',
			},
			{
				to: '/clinic/schedule',
				label: 'وقت‌دهی',
			},
		],
	},
	'therapy-journey': {
		name: 'therapy-journey',
		path: '/therapy-journey',
		icon: 'ph:map-trifold',
		label: 'سفر درمانی',
		color: 'purple',
		sidebarItems: [
			{
				to: '/therapy-journey',
				label: 'شروع',
				icon: 'ph:play',
			},
			{
				to: '/therapy-journey/assessment',
				label: 'ارزیابی',
				icon: 'ph:clipboard',
			},
			{
				to: '/therapy-journey/chat',
				label: 'گفتگو',
				icon: 'ph:chat',
			},
			{
				to: '/therapy-journey/result',
				label: 'نتایج',
				icon: 'ph:chart-bar',
			},
		],
		horizontalNavItems: [
			{
				to: '/therapy-journey',
				label: 'شروع',
			},
			{
				to: '/therapy-journey/assessment',
				label: 'ارزیابی',
			},
			{
				to: '/therapy-journey/chat',
				label: 'گفتگو',
			},
		],
	},
	'hammasir': {
		name: 'hammasir',
		path: '/hammasir',
		icon: 'ph:heartbeat',
		label: 'هم مسیر',
		color: 'red',
		sidebarItems: [
			{
				to: '/hammasir',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/hammasir/patients',
				label: 'بیماران',
				icon: 'ph:users',
			},
			{
				to: '/hammasir/sessions',
				label: 'جلسات',
				icon: 'ph:calendar',
			},
			{
				to: '/hammasir/reports',
				label: 'گزارش‌ها',
				icon: 'ph:file-text',
			},
		],
		horizontalNavItems: [
			{
				to: '/hammasir',
				label: 'داشبورد',
			},
			{
				to: '/hammasir/patients',
				label: 'بیماران',
			},
			{
				to: '/hammasir/sessions',
				label: 'جلسات',
			},
		],
	},
	'baham': {
		name: 'baham',
		path: '/baham',
		icon: 'ph:shopping-cart',
		label: 'با هم',
		color: 'blue',
		sidebarItems: [
			{
				to: '/baham',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/baham/groups',
				label: 'گروه‌ها',
				icon: 'ph:users-three',
			},
			{
				to: '/baham/sessions',
				label: 'جلسات گروهی',
				icon: 'ph:chats-circle',
			},
			{
				to: '/baham/activities',
				label: 'فعالیت‌ها',
				icon: 'ph:activity',
			},
		],
		horizontalNavItems: [
			{
				to: '/baham',
				label: 'داشبورد',
			},
			{
				to: '/baham/groups',
				label: 'گروه‌ها',
			},
			{
				to: '/baham/sessions',
				label: 'جلسات گروهی',
			},
		],
	},
	'khebre': {
		name: 'khebre',
		path: '/khebre',
		icon: 'ph:newspaper',
		label: 'خبره',
		color: 'purple',
		sidebarItems: [
			{
				to: '/khebre',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/khebre/courses',
				label: 'دوره‌ها',
				icon: 'ph:books',
			},
			{
				to: '/khebre/webinars',
				label: 'وبینارها',
				icon: 'ph:video-camera',
			},
			{
				to: '/khebre/certificates',
				label: 'گواهینامه‌ها',
				icon: 'ph:certificate',
			},
		],
		horizontalNavItems: [
			{
				to: '/khebre',
				label: 'داشبورد',
			},
			{
				to: '/khebre/courses',
				label: 'دوره‌ها',
			},
			{
				to: '/khebre/webinars',
				label: 'وبینارها',
			},
		],
	},
	'togetherMama': {
		name: 'togetherMama',
		path: '/togetherMama',
		icon: 'ph:users-three',
		label: 'همپای مادر',
		color: 'green',
		sidebarItems: [
			{
				to: '/togetherMama',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/togetherMama/consultations',
				label: 'مشاوره‌ها',
				icon: 'ph:chat-circle-dots',
			},
			{
				to: '/togetherMama/resources',
				label: 'منابع',
				icon: 'ph:book-open',
			},
			{
				to: '/togetherMama/community',
				label: 'انجمن',
				icon: 'ph:users-three',
			},
		],
		horizontalNavItems: [
			{
				to: '/togetherMama',
				label: 'داشبورد',
			},
			{
				to: '/togetherMama/consultations',
				label: 'مشاوره‌ها',
			},
			{
				to: '/togetherMama/resources',
				label: 'منابع',
			},
		],
	},
	'kanape': {
		name: 'kanape',
		path: '/kanape',
		icon: 'ph:couch',
		label: 'کاناپه',
		color: 'orange',
		sidebarItems: [
			{
				to: '/kanape',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/kanape/relaxation',
				label: 'آرامش',
				icon: 'ph:sleep',
			},
			{
				to: '/kanape/meditation',
				label: 'مراقبه',
				icon: 'ph:yoga',
			},
			{
				to: '/kanape/music',
				label: 'موسیقی درمانی',
				icon: 'ph:music-notes',
			},
		],
		horizontalNavItems: [
			{
				to: '/kanape',
				label: 'داشبورد',
			},
			{
				to: '/kanape/relaxation',
				label: 'آرامش',
			},
			{
				to: '/kanape/meditation',
				label: 'مراقبه',
			},
		],
	},
	'synapse': {
		name: 'synapse',
		path: '/synapse',
		icon: 'ph:brain',
		label: 'سیناپس',
		color: 'indigo',
		sidebarItems: [
			{
				to: '/synapse',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/synapse/ai-analysis',
				label: 'تحلیل هوش مصنوعی',
				icon: 'ph:cpu',
			},
			{
				to: '/synapse/research',
				label: 'تحقیقات',
				icon: 'ph:microscope',
			},
			{
				to: '/synapse/neurofeedback',
				label: 'نوروفیدبک',
				icon: 'ph:activity',
			},
		],
		horizontalNavItems: [
			{
				to: '/synapse',
				label: 'داشبورد',
			},
			{
				to: '/synapse/ai-analysis',
				label: 'تحلیل هوش مصنوعی',
			},
			{
				to: '/synapse/research',
				label: 'تحقیقات',
			},
		],
	},
	'hampazhooh': {
		name: 'hampazhooh',
		path: '/hampazhooh',
		icon: 'ph:buildings',
		label: 'هم‌پژوه',
		color: 'orange',
		sidebarItems: [
			{
				to: '/hampazhooh',
				label: 'داشبورد',
				icon: 'ph:house',
			},
			{
				to: '/hampazhooh/projects',
				label: 'پروژه‌ها',
				icon: 'ph:folder',
			},
		],
		horizontalNavItems: [
			{
				to: '/hampazhooh',
				label: 'داشبورد',
			},
			{
				to: '/hampazhooh/projects',
				label: 'پروژه‌ها',
			},
		],
	},
};

export const useZones = () => {
	const { user } = useUser();
	const route = useRoute();

	// Get current zone based on route
	const currentZone = computed(() => {
		const path = route.path;
		for (const [zonePath, zoneName] of Object.entries({
			'/admin': 'admin',
			'/hamdel': 'hamdel',
			'/hammasir': 'hammasir',
			'/hampazhooh': 'hampazhooh',
			'/baham': 'baham',
			'/khebre': 'khebre',
			'/darmana': 'darmana',
			'/togetherMama': 'togetherMama',
			'/kanape': 'kanape',
			'/synapse': 'synapse',
			'/clinic': 'clinic',
			'/therapy-journey': 'therapy-journey',
		})) {
			if (path.startsWith(zonePath)) {
				return zoneName;
			}
		}
		return null;
	});

	// Get current zone config
	const currentZoneConfig = computed(() => {
		if (!currentZone.value) return null;
		return ZONE_CONFIGS[currentZone.value];
	});

	// Get user zones with their configs
	const userZones = computed(() => {
		if (!user.value?.zones) return [];
		return user.value.zones.map(zone => ZONE_CONFIGS[zone]).filter(Boolean);
	});

	// Check if user has access to a specific zone
	const hasZoneAccess = (zone: string) => {
		if (!user.value?.zones) return false;
		if (zone === 'admin') {
			const { role } = useUser();
			return role.value === 'admin';
		}
		return user.value.zones.includes(zone);
	};

	// Get sidebar items for current zone
	const sidebarItems = computed(() => {
		return currentZoneConfig.value?.sidebarItems || [];
	});

	// Get horizontal nav items for current zone
	const horizontalNavItems = computed(() => {
		return currentZoneConfig.value?.horizontalNavItems || [];
	});

	return {
		currentZone,
		currentZoneConfig,
		userZones,
		hasZoneAccess,
		sidebarItems,
		horizontalNavItems,
		ZONE_CONFIGS,
	};
};
