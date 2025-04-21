import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import LogoIMG from '../assets/img/splash-logo.svg'; // Adjust path
import { auth, db, firebaseConfig } from '../firebaseConfig'; // Adjust path
import { signInWithPhoneNumber } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

// Dummy data arrays
const ramdomEmail = ['Mgg@gmail.com', 'Mg@gmail.com', 'Ag@gmail.com', 'Agg@gamil.com'];
const ramdomPass = ['112233', '332211', '445566', '665544'];
const ramdomName = ['Mayur G', 'Akash G'];
const ramdomPhone = ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666'];

export default function Signup({ navigation }) {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    const [confirmSecureText, setConfirmSecureText] = useState(true);
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(null); // null, 'verify', 'otp', 'success'
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
    const [otpError, setOtpError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const otpInputs = useRef([]);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const recaptchaVerifier = useRef(null);

    // Function to get random item from an array
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

    // Prefill form with random dummy data on component mount
    useEffect(() => {
        prefillRandomData();
    }, []);

    const validateInputs = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z ]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !nameRegex.test(name)) {
            newErrors.name = 'Name must contain only letters';
        }
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!phone || phone.length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        if (!password || password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) return;

        setIsLoading(true);
        try {
            if (!recaptchaVerifier.current) {
                throw new Error('Recaptcha verifier is not initialized');
            }

            console.log('Sending OTP to:', `+91${phone}`);
            const confirmation = await signInWithPhoneNumber(
                auth,
                `+91${phone}`,
                recaptchaVerifier.current
            );
            console.log('Confirmation result:', confirmation);
            setConfirmationResult(confirmation);
            setStep('otp');
        } catch (err) {
            console.error('handleSignUp error:', err);
            const errorMessages = {
                'auth/invalid-phone-number': 'Invalid phone number format.',
                'auth/too-many-requests': 'Too many attempts. Try again later.',
                'auth/quota-exceeded': 'SMS quota exceeded. Contact support.',
                'auth/recaptcha-not-ready': 'reCAPTCHA verification failed. Please try again.',
            };
            setErrors({ firebase: errorMessages[err.code] || err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async () => {
        setIsLoading(true);
        try {
            if (!confirmationResult) {
                throw new Error('No confirmation result available');
            }

            console.log('Verifying OTP');
            const code = otp.join('');
            const userCredential = await confirmationResult.confirm(code);
            const user = userCredential.user;

            console.log('User signed in:', user.uid);

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    name,
                    email,
                    phone,
                    password, // Store password in Firestore (not recommended for production)
                    isPhoneVerified: true,
                });
                console.log('User document created:', { name, email, phone, isPhoneVerified: true });
            } else {
                await setDoc(userDocRef, { isPhoneVerified: true }, { merge: true });
                console.log('Updated user document: isPhoneVerified = true');
            }

            setStep('success');
        } catch (error) {
            console.error('verifyOtp error:', error);
            setOtpError(error.code === 'auth/invalid-verification-code' ? 'Incorrect OTP' : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpBoxChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (otpError) setOtpError('');

        if (text.length === 1 && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleOtpBoxKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const clearError = (fieldName) => {
        setErrors((prevErrors) => {
            if (!prevErrors[fieldName]) return prevErrors;
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[fieldName];
            return updatedErrors;
        });
    };

    // Prefill form with random data
    const prefillRandomData = () => {
        const randomEmail = getRandomItem(ramdomEmail);
        const randomPass = getRandomItem(ramdomPass);
        const randomName = getRandomItem(ramdomName);
        const randomPhone = getRandomItem(ramdomPhone);

        setEmail(randomEmail);
        setPassword(randomPass);
        setConfirmPassword(randomPass);
        setName(randomName);
        setPhone(randomPhone);
        setErrors({});
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={true}
                onError={(error) => {
                    console.error('reCAPTCHA error:', error);
                    Alert.alert('reCAPTCHA Error', 'Failed to initialize reCAPTCHA. Please try again.');
                }}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <View style={styles.imgView}>
                            <LogoIMG width={70} height={70} style={styles.image} />
                        </View>
                        <Text style={styles.title}>Create New Account</Text>
                        <Text style={styles.txtInfo}>Set up your username and password.</Text>
                        <Text style={styles.txtInfoNew}>You can always change it anytime</Text>

                        {/* Button for prefilling data */}
                        <TouchableOpacity onPress={prefillRandomData} style={styles.prefillButton}>
                            <Text style={styles.prefillButtonText}>Fill Random Data</Text>
                        </TouchableOpacity>

                        {errors.firebase && <Text style={styles.errorText}>{errors.firebase}</Text>}

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    clearError('name');
                                }}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    clearError('email');
                                }}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                                value={phone}
                                maxLength={10}
                                onChangeText={(text) => {
                                    setPhone(text.replace(/[^0-9]/g, ''));
                                    clearError('phone');
                                }}
                            />
                            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                            <View style={styles.passwordWrapper}>
                                <TextInput
                                    style={[styles.inputPassword]}
                                    placeholder="Password"
                                    secureTextEntry={secureText}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        clearError('password');
                                    }}
                                />
                                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                    <Feather
                                        name={secureText ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#666"
                                        style={styles.eyeIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            <View style={styles.passwordWrapper}>
                                <TextInput
                                    style={[styles.inputPassword]}
                                    placeholder="Confirm Password"
                                    secureTextEntry={confirmSecureText}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        clearError('confirmPassword');
                                    }}
                                />
                                <TouchableOpacity onPress={() => setConfirmSecureText(!confirmSecureText)}>
                                    <Feather
                                        name={confirmSecureText ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#666"
                                        style={styles.eyeIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        </View>

                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={styles.loginButton}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerLink}>
                            <Text style={styles.registerText}>
                                Already have an account? <Text style={styles.linkText}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Phone Verification Modal */}
                    <Modal visible={step === 'otp'} transparent animationType="fade">
                        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalBox}>
                                    <Text style={styles.modalTitle}>Enter OTP</Text>
                                    <Text style={styles.modalText}>
                                        A 6-digit verification code has been sent to {phone}
                                    </Text>
                                    <View style={styles.otpRow}>
                                        {otp.map((digit, index) => (
                                            <TextInput
                                                key={index}
                                                style={styles.otpInput}
                                                ref={(ref) => (otpInputs.current[index] = ref)}
                                                maxLength={1}
                                                keyboardType="number-pad"
                                                value={digit}
                                                onChangeText={(text) => handleOtpBoxChange(text, index)}
                                                onKeyPress={(e) => handleOtpBoxKeyPress(e, index)}
                                            />
                                        ))}
                                    </View>
                                    {otpError && <Text style={styles.errorText}>{otpError}</Text>}
                                    <TouchableOpacity onPress={handleSignUp} disabled={isLoading || resendDisabled}>
                                        <Text style={[styles.resendLink, (isLoading || resendDisabled) && { color: '#ccc' }]}>
                                            {isLoading ? 'Resending...' : resendDisabled ? 'Resend in 30s' : 'Resend OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={verifyOtp}
                                        style={styles.modalButton}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.modalBtnText}>{isLoading ? 'Verifying...' : 'Verify'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </BlurView>
                    </Modal>

                    {/* Success Modal */}
                    <Modal visible={step === 'success'} transparent animationType="fade">
                        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalBox}>
                                    <Text style={styles.modalTitle}>Account Created</Text>
                                    <Text style={styles.modalText}>Your account has been created successfully.</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setStep(null);
                                            navigation.replace('Homepage');
                                        }}
                                        style={styles.modalButton}
                                    >
                                        <Text style={styles.modalBtnText}>Continue to Home</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </BlurView>
                    </Modal>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 60,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 12,
        fontSize: 18,
    },
    loginButton: {
        backgroundColor: '#5ac268',
        paddingVertical: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 25,
    },
    loginText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    registerLink: {
        alignItems: 'center',
        marginBottom: 20,
    },
    registerText: {
        fontSize: 16,
        color: '#666',
    },
    linkText: {
        color: '#5ac268',
        fontWeight: 'bold',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
        height: 60,
        justifyContent: 'space-between',
    },
    inputPassword: {
        flex: 1,
        height: 60,
        marginBottom: 0,
        paddingHorizontal: 0,
        fontSize: 18,
    },
    eyeIcon: {
        marginLeft: 10,
    },
    imgView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 0,
    },
    image: {
        marginBottom: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        marginTop: -10,
    },
    txtInfo: {
        color: '#bbb',
        fontSize: 18,
        textAlign: 'center',
    },
    txtInfoNew: {
        marginBottom: 20,
        color: '#bbb',
        fontSize: 18,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalBox: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
    modalButton: {
        backgroundColor: '#5ac268',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 50,
    },
    modalBtnText: {
        fontSize: 16,
        color: '#fff',
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
        gap: 8,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: 45,
        height: 45,
        fontSize: 18,
        textAlign: 'center',
    },
    resendLink: {
        color: '#5ac268',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    prefillButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    prefillButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});