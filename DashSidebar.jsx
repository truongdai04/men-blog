import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';


export default function DashSidebar() {
    const location = useLocation(); // Để lấy URL hiện tại
    const dispatch = useDispatch();
   
    
    const [tab, setTab] = useState(''); // Trạng thái cho tab hiện tại
  
    // Cập nhật tab khi URL thay đổi (dựa vào tham số 'tab' trong URL)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab'); // Lấy giá trị của tham số 'tab'
        
        // Nếu có tham số 'tab' trong URL thì cập nhật giá trị của tab
        if (tabFromUrl) {
            setTab(tabFromUrl);
        } else {
            setTab(''); // Nếu không có tham số 'tab', set giá trị mặc định là rỗng
        }
    }, [location.search]); // Chạy lại khi URL thay đổi

    // Xử lý đăng xuất
    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', 
                { method: 'POST',
                 });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
               
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    {/* Link tới trang Profile và thêm tham số 'tab=profile' */}
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item 
                            active={tab === 'profile'} // Kiểm tra xem tab hiện tại có phải là 'profile' không
                            icon={HiUser} 
                            label="Profile" 
                            labelColor="dark" 
                            as='div'
                        >
                            User
                        </Sidebar.Item>
                    </Link>
                    
                    {/* Mục đăng xuất */}
                    <Sidebar.Item 
                        icon={HiArrowSmRight} 
                        className='cursor-pointer' 
                        onClick={handleSignout}
                    >
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup> 
            </Sidebar.Items>
        </Sidebar>
    );
}
