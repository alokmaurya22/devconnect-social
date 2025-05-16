const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-light-bg dark:bg-dark-bg text-gray-600 dark:text-gray-400 text-sm py-4 border-t dark:border-gray-700 z-50">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-brand-orange">Social Sphere</span>. All rights reserved.</p>
                <div className="hidden sm:flex gap-4">
                    <a href="#" className="hover:text-brand-orange transition">Privacy</a>
                    <a href="#" className="hover:text-brand-orange transition">Terms</a>
                    <a href="#" className="hover:text-brand-orange transition">Contact</a>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
