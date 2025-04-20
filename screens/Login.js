import React, { useState } from 'react';
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
  Keyboard
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'

export default function Login({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleLogin = () => {
    // TODO: Add real auth logic here
  };

  const handleGoogleLogin = async () => {
    // TODO: Implement Google OAuth flow
  };

  const handleAppleLogin = async () => {
    // TODO: Implement Apple login if needed
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.txtInfo}>Login to your account using phone number or using social accounts</Text>

            <View style={styles.socialLogin}>
              <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                <FontAwesome name="apple" size={26} color="#000" style={styles.icon} />
                <Text style={styles.socialText}>Login with Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                <FontAwesome name="google" size={26} color="#EA4335" style={styles.icon} />
                <Text style={styles.socialText}>Login with Google</Text>
              </TouchableOpacity>
              <Text style={styles.txtContinue}>Or Continue with your phone number</Text>
            </View>



            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                maxLength={10}
                onChangeText={setPhone}
              />
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.inputPassword]}
                  placeholder="Password"
                  secureTextEntry={secureText}
                  value={password}
                  onChangeText={setPassword}
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

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPassword}
              >
                <Text style={styles.linkText}>Forgot Password ?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.registerLink}>
              <Text style={styles.registerText}>
                Don’t have an account ? <Text style={styles.linkText}>Register Now</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 20,
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
  }
});