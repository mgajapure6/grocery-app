// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons'

// import { auth } from '../firebaseConfig'; // Adjust path
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { getDoc, doc, getFirestore } from 'firebase/firestore';

// export default function Login({ navigation }) {
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [secureText, setSecureText] = useState(true);
//   const [error, setError] = useState('');
//   const [errors, setErrors] = useState({});

//   const db = getFirestore();

//   const validateInputs = () => {
//     const inputErrors = {};
//     if (!phone || phone.length !== 10) {
//       inputErrors.phone = 'Please enter valid phone number';
//     }
//     if (!password || password.length < 6) {
//       inputErrors.password = 'Please enter valid password';
//     }
//     setErrors(inputErrors);
//     return Object.keys(inputErrors).length === 0;
//   }

//   const handleLogin = async () => {
//     if (!validateInputs()) return;

//     try {
//       // Assume email is stored as phone-based email (e.g., phone@example.com)
//       const email = `${phone}@ggmart.com`; // Adjust based on your signup logic
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Check if phone is verified
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       if (userDoc.exists() && userDoc.data().isPhoneVerified) {
//         navigation.replace('Homepage');
//       } else {
//         navigation.navigate('PhoneVerification', { phone });
//       }
//     } catch (err) {
//       console.log(err)
//       setError("Invalid Credentials");
//       setTimeout(()=>{
//         setError("");
//       }, 1500)
//     }
//   };

//   const handleGoogleLogin = async () => {
//     // TODO: Implement Google OAuth flow
//   };

//   const handleAppleLogin = async () => {
//     // TODO: Implement Apple login if needed
//   };

//   const clearError = (fieldName) => {
//     setErrors((prevErrors) => {
//       if (!prevErrors[fieldName]) return prevErrors;
//       const updatedErrors = { ...prevErrors };
//       delete updatedErrors[fieldName];
//       return updatedErrors;
//     });
//   };

  
//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{ flex: 1 }}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//           <View style={styles.container}>
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.txtInfo}>Login to your account using phone number</Text>

//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Phone Number"
//                 keyboardType="phone-pad"
//                 value={phone}
//                 maxLength={10}
//                 onChangeText={(text) => {
//                   setPhone(text.replace(/[^0-9]/g, ''));
//                   clearError('phone');
//                 }}
//               />
//               {errors.phone && <Text style={styles.inputErrorText}>{errors.phone}</Text>}
//               <View style={styles.passwordWrapper}>
//                 <TextInput
//                   style={[styles.inputPassword]}
//                   placeholder="Password"
//                   secureTextEntry={secureText}
//                   value={password}
//                   onChangeText={(text) => {
//                     setPassword(text);
//                     clearError('password');
//                   }}
//                 />
//                 <TouchableOpacity onPress={() => setSecureText(!secureText)}>
//                   <Feather
//                     name={secureText ? 'eye-off' : 'eye'}
//                     size={20}
//                     color="#666"
//                     style={styles.eyeIcon}
//                   />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && <Text style={styles.inputErrorText}>{errors.password}</Text>}

//               <TouchableOpacity
//                 onPress={() => navigation.navigate('ForgotPassword')}
//                 style={styles.forgotPassword}
//               >
//                 <Text style={styles.linkText}>Forgot Password ?</Text>
//               </TouchableOpacity>
//             </View>

//             {error ? <Text style={styles.fbErrorText}>{error}</Text> : null}

//             <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
//               <Text style={styles.loginText}>Login</Text>
//             </TouchableOpacity>

//             <View style={styles.socialLogin}>
//               <Text style={styles.txtContinue}>Or Continue with Social Accounts</Text>
//               <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
//                 <FontAwesome name="apple" size={26} color="#000" style={styles.icon} />
//                 <Text style={styles.socialText}>Login with Apple</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
//                 <FontAwesome name="google" size={26} color="#EA4335" style={styles.icon} />
//                 <Text style={styles.socialText}>Login with Google</Text>
//               </TouchableOpacity>
              
//             </View>
//             <TouchableOpacity onPress={() => navigation.navigate('Signup2')} style={styles.registerLink}>
//               <Text style={styles.registerText}>
//                 Don’t have an account ? <Text style={styles.linkText}>Register Now 2</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginBottom: 0,
//   },
//   input: {
//     height: 60,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 15,
//     paddingHorizontal: 12,
//     fontSize: 18
//   },
//   forgotPassword: {
//     alignItems: 'flex-end',
//     marginTop: -10,
//     marginBottom: 20,
//   },
//   loginButton: {
//     backgroundColor: '#5ac268',
//     paddingVertical: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   loginText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '700',
//   },
//   socialLogin: {
//     alignItems: 'center',
//     gap: 10,
//     marginBottom: 30
//   },
//   socialButton: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#eee',
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 10,
//     paddingVertical: 15
//   },
//   socialText: {
//     fontSize: 18,
//     color: '#000',
//   },
//   txtContinue: {
//     marginBottom: 20,
//     color: '#bbb',
//     fontSize: 18
//   },
//   txtInfo: {
//     marginBottom: 20,
//     color: '#bbb',
//     fontSize: 18,
//     textAlign: 'center'
//   },
//   appleButton: {
//     width: '100%',
//     height: 44,
//   },
//   registerLink: {
//     alignItems: 'center',
//   },
//   registerText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   linkText: {
//     color: '#5ac268',
//     fontWeight: 'bold',
//   },
//   icon: {

//   },
//   passwordWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 15,
//     height: 60,
//     justifyContent: 'space-between',
//   },
//   inputPassword: {
//     flex: 1,
//     height: 60,
//     marginBottom: 0,
//     paddingHorizontal: 0,
//     fontSize: 18
//   },
//   eyeIcon: {
//     marginLeft: 10,
//   },
//   fbErrorText:{
//     color: 'red',
//     fontSize: 14,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   inputErrorText:{
//     color: 'red',
//     fontSize: 14,
//     marginBottom: 10,
//     marginTop: -10,
//     textAlign: 'auto',
//   }
// });


// ------------------------------------------------------------------------------------------------
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
import { BlurView } from 'expo-blur';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import LogoIMG from '../assets/img/splash-logo.svg'; // Adjust path
import { auth, db, firebaseConfig } from '../firebaseConfig'; // Adjust path
import { signInWithPhoneNumber } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

// Dummy data array
const ramdomPhone = ['1111111111', '2222222222', '3333333333', '4444444444', '5555555555', '6666666666'];

export default function Login({ navigation }) {
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(null); // null, 'otp', 'success'
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

    if (!phone || phone.length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setResendDisabled(true);
    try {
      // Check if user exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No account found with this phone number');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (!userData.isPhoneVerified) {
        throw new Error('Phone number not verified');
      }

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
      console.error('handleLogin error:', err);
      const errorMessages = {
        'auth/invalid-phone-number': 'Invalid phone number format.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/quota-exceeded': 'SMS quota exceeded. Contact support.',
        'auth/recaptcha-not-ready': 'reCAPTCHA verification failed. Please try again.',
      };
      setErrors({ firebase: errorMessages[err.code] || err.message });
    } finally {
      setIsLoading(false);
      setTimeout(() => setResendDisabled(false), 30000);
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

      // Verify user document exists and isPhoneVerified
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists() || !userDoc.data().isPhoneVerified) {
        throw new Error('User not found or phone not verified');
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

  // Prefill form with random phone number
  const prefillRandomData = () => {
    const randomPhone = getRandomItem(ramdomPhone);
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
            <Text style={styles.title}>Login to Your Account</Text>
            <Text style={styles.txtInfo}>Enter your phone number to continue.</Text>
            <Text style={styles.txtInfoNew}>Welcome back!</Text>

            {/* Button for prefilling data */}
            <TouchableOpacity onPress={prefillRandomData} style={styles.prefillButton}>
              <Text style={styles.prefillButtonText}>Fill Random Data</Text>
            </TouchableOpacity>

            {errors.firebase && <Text style={styles.errorText}>{errors.firebase}</Text>}

            <View style={styles.inputContainer}>
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
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={isLoading}
            >
              <Text style={styles.loginText}>{isLoading ? 'Logging In...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.registerLink}>
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* OTP Input Modal */}
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
                  <TouchableOpacity onPress={handleLogin} disabled={isLoading || resendDisabled}>
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
                  <Text style={styles.modalTitle}>Login Successful</Text>
                  <Text style={styles.modalText}>You have successfully logged in.</Text>
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