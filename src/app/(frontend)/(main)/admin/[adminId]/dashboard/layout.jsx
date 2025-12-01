"use client";
import SideNavigation from '@/components/Pages/AdminDashboard/SideNavigation/SideNavigation';
import style from '@/components/Pages/AdminDashboard/style/adminDashboards.module.scss';

export default function DashboardLayout({ children }) {
	return (
		<div className={style.dashboardContainer}>
			<div className={style.sidebarWrapper}>
				<SideNavigation />
			</div>
			<div className={style.contentWrapper}>{children}</div>
		</div>
	);
}
