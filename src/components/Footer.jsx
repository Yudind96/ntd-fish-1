import { Link } from 'react-router';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        marketing: [
            { id: 'mkt-1', label: 'Marketing on Facebook', to: '/#' },
            { id: 'mkt-2', label: 'Marketing Objectives', to: '/#' },
            { id: 'mkt-3', label: 'Facebook Pages', to: '/#' },
            { id: 'mkt-4', label: 'Facebook Ads', to: '/#' },
            { id: 'mkt-5', label: 'Success Stories', to: '/#' },
            { id: 'mkt-6', label: 'Measurement', to: '/#' },
            { id: 'mkt-7', label: 'Industries', to: '/#' },
            { id: 'mkt-8', label: 'Events', to: '/#' },
            { id: 'mkt-9', label: 'News', to: '/#' },
            { id: 'mkt-10', label: 'Site Map', to: '/#' }
        ],
        business: [
            { id: 'biz-1', label: 'Build your Presence', to: '/#' },
            { id: 'biz-2', label: 'Create Awareness', to: '/#' },
            { id: 'biz-3', label: 'Drive Discovery', to: '/#' },
            { id: 'biz-4', label: 'Generate Leads', to: '/#' },
            { id: 'biz-5', label: 'Boost Sales', to: '/#' },
            { id: 'biz-6', label: 'Earn Loyalty', to: '/#' },
            { id: 'biz-7', label: 'Inspiration', to: '/#' }
        ],
        resources: [
            { id: 'res-1', label: 'Get Started with Pages', to: '/#' },
            { id: 'res-2', label: 'Setting up your Page', to: '/#' },
            { id: 'res-3', label: 'Manage Facebook Page', to: '/#' },
            { id: 'res-4', label: 'Promote your Page', to: '/#' },
            { id: 'res-5', label: 'Messaging on your Page', to: '/#' },
            { id: 'res-6', label: 'Page Insights', to: '/#' },
            { id: 'res-7', label: 'Meta Business Partners', to: '/#' },
            { id: 'res-8', label: 'Instagram Business', to: '/#' },
            { id: 'res-9', label: 'Support', to: '/#' }
        ],
        advertising: [
            { id: 'ad-1', label: 'Get Started with Ads', to: '/#' },
            { id: 'ad-2', label: 'Buying Facebook Ads', to: '/#' },
            { id: 'ad-3', label: 'Ad Formats', to: '/#' },
            { id: 'ad-4', label: 'Ad Placement', to: '/#' },
            { id: 'ad-5', label: 'Choose your Audience', to: '/#' },
            { id: 'ad-6', label: 'Measure your Ads', to: '/#' },
            { id: 'ad-7', label: 'Managing your Ads', to: '/#' },
            { id: 'ad-8', label: 'Ads Guide', to: '/#' }
        ]
    };

    const renderLinks = (links) => (
        <ul className='space-y-2'>
            {links.map((link) => (
                <li key={link.id}>
                    <Link to={link.to} className='block text-xs text-[#E4E6EB] transition-colors duration-200 hover:text-white'>
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );

    const languages = [
        { id: 'lang-1', label: 'English (US)', code: 'en-US' },
        { id: 'lang-2', label: 'Tiếng Việt', code: 'vi' },
        { id: 'lang-3', label: '中文(台灣)', code: 'zh-TW' },
        { id: 'lang-4', label: '한국어', code: 'ko' },
        { id: 'lang-5', label: '日本語', code: 'ja' },
        { id: 'lang-6', label: 'Français (France)', code: 'fr' },
        { id: 'lang-7', label: 'ภาษาไทย', code: 'th' },
        { id: 'lang-8', label: 'Español', code: 'es' },
        { id: 'lang-9', label: 'Português (Brasil)', code: 'pt-BR' },
        { id: 'lang-10', label: 'Deutsch', code: 'de' },
        { id: 'lang-11', label: 'Italiano', code: 'it' }
    ];

    const bottomLinks = [
        { id: 'bottom-1', label: 'About', to: '/#' },
        { id: 'bottom-2', label: 'Developers', to: '/#' },
        { id: 'bottom-3', label: 'Careers', to: '/#' },
        { id: 'bottom-4', label: 'Privacy', to: '/#' },
        { id: 'bottom-5', label: 'Cookies', to: '/#' },
        { id: 'bottom-6', label: 'Terms', to: '/#' },
        { id: 'bottom-7', label: 'Help Centre', to: '/#' }
    ];

    return (
        <footer className='mt-0.5 w-full border-t border-[#4267B2] bg-[#355797]'>
            <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
                {/* Main Footer Links */}
                <div className='mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5'>
                    <div className='space-y-3'>
                        <h3 className='mb-4 text-sm font-semibold tracking-wider text-white uppercase'>Marketing</h3>
                        {renderLinks(footerLinks.marketing)}
                    </div>
                    <div className='space-y-3'>
                        <h3 className='mb-4 text-sm font-semibold tracking-wider text-white uppercase'>Business Growth</h3>
                        {renderLinks(footerLinks.business)}
                    </div>
                    <div className='space-y-3'>
                        <h3 className='mb-4 text-sm font-semibold tracking-wider text-white uppercase'>Pages</h3>
                        {renderLinks(footerLinks.resources)}
                    </div>
                    <div className='space-y-3'>
                        <h3 className='mb-4 text-sm font-semibold tracking-wider text-white uppercase'>Advertising</h3>
                        {renderLinks(footerLinks.advertising)}
                    </div>
                    <div className='space-y-3'>
                        <h3 className='mb-4 text-sm font-semibold tracking-wider text-white uppercase'>Resources</h3>
                        {renderLinks(footerLinks.resources)}
                    </div>
                </div>

                {/* Divider */}
                <div className='border-t border-[#4267B2] pt-6'>
                    {/* Languages Section */}
                    <div className='mb-6'>
                        <div className='flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#E4E6EB]'>
                            {languages.map((lang, index) => (
                                <span key={lang.id}>
                                    <button className='transition-colors duration-200 hover:text-white' onClick={() => {}}>
                                        {lang.label}
                                    </button>
                                    {index < languages.length - 1 && <span className='ml-4 text-[#4267B2]'>•</span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Links & Copyright */}
                    <div className='flex flex-col items-center justify-around gap-1 sm:flex-row'>
                        <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#E4E6EB]'>
                            {bottomLinks.map((link, index) => (
                                <span key={link.id}>
                                    <Link to={link.to} className='transition-colors duration-200 hover:text-white'>
                                        {link.label}
                                    </Link>
                                    {index < bottomLinks.length - 1 && <span className='ml-6 text-[#4267B2]'>•</span>}
                                </span>
                            ))}
                        </div>
                        <div className='text-xs text-[#E4E6EB]'>
                            <span>&copy; {currentYear} Meta</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
