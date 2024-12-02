import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from "react-icons/bs";
import { Link } from "react-router-dom";


export default function FooterCom() {
  return (
    <Footer container className="border-t-8 border-b-2 border-teal-500 pb-6 mt-10">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full sm:flex justify-between md:grid-cols-1">
          <div className="mt-5">
            <Link
              to='/'
              className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Sahand`s
              </span>
              Blog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-4 pb-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  100 JS Projects
                </Footer.Link>
                <Footer.Link
                  to="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sahand`s Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com/sahandghavidel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full flex items-center justify-items-between mt-6">
            <Footer.Copyright href="#" by="Shand`s blog" 
            year={new Date().getFullYear()}
            /> 
            <div className="flex gap-6 ml-auto">
                <Footer.Icon href="#" icon={BsFacebook}/>
                <Footer.Icon href="#" icon={BsInstagram}/>
                <Footer.Icon href="#" icon={BsTwitter}/>
                <Footer.Icon href="https://www.github.com/sahandghavidel" icon={BsGithub}/>
                <Footer.Icon href="#" icon={BsDribbble}/>
            </div>
        </div>
      </div>
    </Footer>
  );
}
