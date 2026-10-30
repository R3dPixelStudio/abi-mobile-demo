import {ClubPanel} from '@/components/club';
import {Breadcrumb} from '@/components/ui';
export const metadata={title:'باشگاه آبی | امتیازهای یک همراهی',description:'پیش‌نمایش باشگاه مشتریان آبی؛ خریدهای نمایشی، امتیاز آبی و مسیر مزایای آینده.'};
export default function ClubPage(){return <div className="container"><Breadcrumb items={[{label:'باشگاه آبی'}]}/><ClubPanel/></div>}
