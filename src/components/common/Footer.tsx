import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {

    return (

        // <footer className="bg-gray-100 py-10 px-4 md:px-10 text-sm text-gray-700">
        //     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        //         <div>
        //             <h4 className="font-bold mb-2">Company</h4>
        //             <ul className="space-y-1">
        //                 <li>About Us</li>
        //                 <li>Legal Notice</li>
        //                 <li>Terms & Conditions</li>
        //                 <li>Secure Payment</li>
        //             </ul>
        //         </div>
        //         <div>
        //             <h4 className="font-bold mb-2">Category</h4>
        //             <ul className="space-y-1">
        //                 <li>Clothes</li>
        //                 <li>Shoes</li>
        //                 <li>Watches</li>
        //                 <li>Dresses</li>
        //             </ul>
        //         </div>
        //         <div>
        //             <h4 className="font-bold mb-2">Account</h4>
        //             <ul className="space-y-1">
        //                 <li>Sign In</li>
        //                 <li>View Cart</li>
        //                 <li>Become a Vendor</li>
        //                 <li>Affiliate Program</li>
        //             </ul>
        //         </div>
        //         <div>
        //             <h4 className="font-bold mb-2">Contact</h4>
        //             <p>123 Address Street<br />City, Country</p>
        //             <p className="mt-2">+123 456 7890</p>
        //             <p>email@example.com</p>
        //         </div>
        //     </div>
        //     <p className="text-center mt-10">&copy; {new Date().getFullYear()} YourBrand. All rights reserved.</p>
        // </footer>
        <footer className=" text-gray-700 text-sm  py-10 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-12 pb-10  grid grid-cols-1 md:grid-cols-5 gap-8">

                {/* Logo & Description */}
                <div className="md:col-span-1">
                    <img src="/logo.png" alt="Logo" className="h-14 mb-4" />
                    <p className="mb-1">Grabit is the biggest market of grocery products.</p>
                    <p>Get your daily needs from our store.</p>
                </div>

                {/* Category */}
                <div>
                    <h4 className="font-semibold mb-2 border-b pb-1">Category</h4>
                    <ul className="space-y-1">
                        <li>Clothes</li>
                        <li>Sandles</li>
                        <li>Beads</li>
                        <li>Ties</li>
                        <li>Heals</li>
                        <li>Kids</li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="font-semibold mb-2 border-b pb-1">Company</h4>
                    <ul className="space-y-1">
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Legal Notice</li>
                        <li>Terms & conditions</li>
                        <li>Secure payment</li>
                        <li>Contact us</li>
                    </ul>
                </div>

                {/* Account */}
                <div>
                    <h4 className="font-semibold mb-2 border-b pb-1">Account</h4>
                    <ul className="space-y-1">
                        <li>Sign In</li>
                        <li>View Cart</li>
                        <li>Return Policy</li>
                        <li>Become a Vendor</li>
                        <li>Affiliate Program</li>
                        <li>Payments</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold mb-2 border-b pb-1">Contact</h4>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <span>📍</span>
                            <span>2548 Broaddus Maple Court, Madisonville KY 4783, USA</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>📞</span>
                            <span>+00 9876543210</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>✉️</span>
                            <span>example@email.com</span>
                        </li>
                    </ul>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-3 mt-4">
                            <Link href="#" className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                                <FaFacebookF size={16} />
                            </Link>
                            <Link href="#" className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                                <FaTwitter size={16} />
                            </Link>
                            <Link href="#" className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                                <FaLinkedinIn size={16} />
                            </Link>
                            <Link href="#" className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                                <FaInstagram size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-200 py-2 px-12 lg:flex text-center text-xs ">
                Copyright &copy; Grabit {new Date().getFullYear()}. All rights reserved. Powered by Grabit.
            </div>
        </footer>


    )

}

export default Footer;