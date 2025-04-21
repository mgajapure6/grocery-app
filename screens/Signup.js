import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
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
  Modal
} from 'react-native';
import LogoIMG from '../assets/img/splash-logo.svg';
import { BlurView } from 'expo-blur';
import { auth } from '../firebaseConfig'; // Adjust the path as needed
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
} from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

export default function Signup({ navigation }) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [confirmSecureText, setConfirmSecureText] = useState(true);
  const [errors, setErrors] = useState({});
  const [errorFb, setErrorFb] = useState("");
  const [step, setStep] = useState(null); // null, 'verify', 'otp', 'success'
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpInputs = useRef([]);
  const [confirmationResult, setConfirmationResult] = useState(null);


  const handleSignUp = async () => {
    // TODO: Add real auth logic here
    // const newErrors = {};
    // const nameRegex = /^[A-Za-z ]+$/;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!name || !nameRegex.test(name)) {
    //   newErrors.name = 'Name must contain only letters';
    // }

    // if (!email || !emailRegex.test(email)) {
    //   newErrors.email = 'Please enter a valid email';
    // }

    // if (!phone || phone.length !== 10) {
    //   newErrors.phone = 'Phone number must be 10 digits';
    // }

    // if (!password || password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    // }

    // if (password !== confirmPassword) {
    //   newErrors.confirmPassword = 'Passwords do not match';
    // }

    // setErrors(newErrors);

    // if (Object.keys(newErrors).length === 0) {
    //   // All fields are valid
    //   setStep('verify'); // open phone verification dialog
    //   // TODO: Handle actual signup logic
    // }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully!");
      setErrorFb("");
      setStep('verify');
    } catch (err) {
      setErrorFb(err.message);
    }

    



  };

  const sendOtp = async () => {
    try {
      const appVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      }, auth);

      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const code = otp.join('');
      await confirmationResult.confirm(code);
      setStep('success');
    } catch (error) {
      setOtpError('Incorrect OTP');
    }
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => {
      if (!prevErrors[fieldName]) return prevErrors; // nothing to clear
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };


  const handleGoogleLogin = async () => {
    // TODO: Implement Google OAuth flow
  };

  const handleAppleLogin = async () => {
    // TODO: Implement Apple login if needed
  };

  const handleOtpBoxChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 3) {
      otpInputs.current[index + 1].focus();
    }
  }

  const handleOtpBoxKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.imgView}>
              <LogoIMG width={70} height={70} style={styles.image} />
            </View>
            <Text style={styles.title}>Create New Account</Text>
            <Text style={styles.txtInfo}>Set up your username and password.</Text>
            <Text style={styles.txtInfoNew}>you can always change it anytime</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="name"
                keyboardType='default'
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
                keyboardType='email-address'
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

            <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
              <Text style={styles.loginText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerLink}>
              <Text style={styles.registerText}>
                Already have an Account? <Text style={styles.linkText}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>


          <Modal visible={step === 'verify'} transparent animationType="fade">
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Verify Phone Number</Text>
                  <Text style={styles.modalText}>
                    We will send a 4-digit OTP to your phone number: {phone}
                  </Text>
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity onPress={() => setStep(null)} style={styles.modalButtonOutline}>
                      <Text style={styles.modalBtnTextCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStep('otp')} style={styles.modalButton}>
                      <Text style={styles.modalBtnText}>Continue</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </BlurView>

          </Modal>

          <Modal visible={step === 'otp'} transparent animationType="fade">
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Enter OTP</Text>
                  <Text style={styles.modalText}>
                    A verification code has been sent to {phone}
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
                        // onChangeText={(text) => {
                        //   const newOtp = [...otp];
                        //   newOtp[index] = text;
                        //   setOtp(newOtp);
                        //   if (otpError) setOtpError('');
                        // }}
                        onChangeText={(text) => handleOtpBoxChange(text, index)}
                        onKeyPress={(e) => handleOtpBoxKeyPress(e, index)}
                      />
                    ))}
                  </View>
                  {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
                  <TouchableOpacity>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const enteredOtp = otp.join('');
                      if (enteredOtp === '1234') {
                        setStep('success');
                      } else {
                        setOtpError('Incorrect OTP');
                      }
                    }}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalBtnText}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>

          </Modal>


          <Modal visible={step === 'success'} transparent animationType="fade">
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill}><View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Account Created</Text>
                <Text style={styles.modalText}>Your account has been created successfully.</Text>
                <TouchableOpacity
                  onPress={() => {
                    setStep(null);
                    navigation.navigate('Homepage');
                  }}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalBtnText}>Continue to Home</Text>
                </TouchableOpacity>
              </View>
            </View></BlurView>

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
    marginBottom: 30,
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
    fontSize: 18
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: -10,
    marginBottom: 20,
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
  socialLogin: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 30
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15
  },
  socialText: {
    fontSize: 18,
    color: '#000',
  },
  txtContinue: {
    marginTop: 20,
    color: '#bbb',
    fontSize: 18
  },
  txtInfo: {
    color: '#bbb',
    fontSize: 18,
    textAlign: 'center'
  },
  txtInfoNew: {
    marginBottom: 30,
    color: '#bbb',
    fontSize: 18,
    textAlign: 'center'
  },
  appleButton: {
    width: '100%',
    height: 44,
  },
  registerLink: {
    alignItems: 'center',
    marginBottom: 20
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  linkText: {
    color: '#5ac268',
    fontWeight: 'bold',
  },
  icon: {

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
    fontSize: 18
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
    marginBottom: 2
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -10
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
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    // flex: 1,
    backgroundColor: '#5ac268',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 50
  },
  modalButtonOutline: {
    flex: 1,
    borderColor: '#5ac268',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnTextCancel: {
    fontSize: 16,
    color: '#000',
  },
  modalBtnText: {
    fontSize: 16,
    color: '#fff',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 10,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 50,
    height: 50,
    fontSize: 20,
    textAlign: 'center',
  },
  resendLink: {
    color: '#5ac268',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }

});