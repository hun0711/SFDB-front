import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import SearchBar from "./SearchBar";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import ToolBar from "./ToolBar";
import AppBar from "./AppBar";
import { userAuth } from "../utils/userAuth"
import { useNavigate } from "react-router";
import { serialize } from "cookie";
import { useState } from "react";

const rightLink = {
  fontSize: 18,
  color: "white",
  ml: 3,
  lineHeight: "1",
  padding: "8px 12px",
};

function HeaderBar() {
  const userId = userAuth(); //회원 아이디 확인 (쿠키 식별용)
  const navigate = useNavigate();


  const [isMenubarOpen, setIsMenubarOpen] = useState(false);

  //메뉴바 띄우기
  const handleMenuIconClick = () => {
    setIsMenubarOpen(!isMenubarOpen);
  };

  const handleGoogleLogout = async () => {
    try {
      if (!gapi.auth2) {
        // 구글 API 스크립트 로드를 기다리기 위해 promise를 사용
        await new Promise((resolve) => {
          gapi.load('auth2', resolve);
        });
      }
  
      const auth2 = gapi.auth2.getAuthInstance();
      await auth2.signOut();
  
    } catch (error) {
      console.error('Google 로그아웃 에러:', error);
    }
  };
  

  

  //로그아웃 수행
  const handleLogout = () => {
    // 쿠키 삭제
    document.cookie = serialize('userId', '', { path: '/', maxAge: -1 });
    document.cookie = serialize('userName', '', { path: '/', maxAge: -1 });
    document.cookie = serialize('userEmail', '', { path: '/', maxAge: -1 });
    document.cookie = serialize('userBirth', '', { path: '/', maxAge: -1 });
    document.cookie = serialize('userProfileImage', '', { path: '/', maxAge: -1 });
  


    // 'naverToken' 쿠키가 존재할 경우 삭제 - 네이버 로그아웃
    const naverToken = getCookieValue('naverToken');
    if (naverToken) {
      document.cookie = serialize('naverToken', '', { path: '/', maxAge: -1 });
    }
  
     // 구글 로그아웃
    handleGoogleLogout();


    // 로컬 스토리지에 저장된 데이터를 모두 삭제
    localStorage.clear();

  
    navigate('/main');
    window.location.reload();
  };
  
  // 쿠키 이름으로 쿠키 값을 가져오는 함수
  function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }


  return (
    <div>
      <AppBar position="fixed"> 
        <ToolBar sx={{ justifyContent: "space-between" }}>
          {/* Menu Icon and text aligned at the same height */}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
            <IconButton sx={{ color: "white" }} onClick={handleMenuIconClick}>
              <MenuIcon />
              {"MENU"}
            </IconButton>
          </Box>

          {/* Logo and "SFDB" centered */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems:'center' }}>
            <img
              src="/images/SF-DBW.png"
              alt="SF-DB logo"
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
            <Link
              variant="h6"
              underline="none"
              color="inherit"
              href="/main"
              sx={{ fontSize: 24 }}
            >
              {"SFDB"}
            </Link>
          </Box>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {/* Search Bar */}
            <Box>
              <SearchBar />
            </Box>

            {userId ? ( // 로그인 상태에 따라 다른 링크 표시
              <>
                {/* Logout Link */}
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  onClick={handleLogout}
                  sx={rightLink}
                >
                  {"로그아웃"}
                </Link>

                {/* My Info Link */}
                <Link
                  variant="h6"
                  underline="none"
                  href="/myInfo" // 내 정보 페이지로 설정
                  sx={{ ...rightLink, color: "science.main" }}
                >
                  {"내 정보"}
                </Link>
              </>
            ) : (
              <>
                {/* Login Link */}
                <Link
                  color="inherit"
                  variant="h6"
                  underline="none"
                  href="/login"
                  sx={rightLink}
                >
                  {"로그인"}
                </Link>

                {/* Register Link */}
                <Link
                  variant="h6"
                  underline="none"
                  href="/register"
                  sx={{ ...rightLink, color: "science.main" }}
                >
                  {"가입하기"}
                </Link>
              </>
            )}
          </Box>
        </ToolBar>
      </AppBar>


    </div>
  );
}

export default HeaderBar;