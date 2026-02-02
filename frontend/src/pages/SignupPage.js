import {useState} from 'react';
import axios from 'axios';

export default function SignupPage({ onSignupSuccess }) {
    //formData = object storing all the form input values
    //setFormData = function to update formData
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });

    // error = stores error message (if signup fails)
    // loading = true while waiting for backend to respond (shows "Creating account... button")
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //what happens when user types in an input
    //e = event object (contains info about what changed)
    //e.target = the input element that changed
    //name = the inputs name attribute (e.g, "email", "password")
    //value = what the user typed

    //Example: 
    //user types in email field 
    // name = "email"
    // value = "karim@example.com"
    // setFormData({ ...formData, [name]: value }) updates the formData object

    //The ...formDara part:
    // ... = spread operator (copies all existing data)
    // [name]: value = updates just that one field
    // so we keep old values and only change what the user typed

    const handleChange = (e) => {
        const{ name, value} = e.target;
        setFormData({ ...formData, [name]: value});
    };


    //Handle Signup Function
    const handleSignup = async(e) => {
        //e.preventDefault() = stops the form from refreshing the page (we handle it with axios instead)
        e.preventDefault();

        //clear any previous message
        //set loading to true
        setError('');
        setLoading(true);

        try{
            //axios.post() send a POST request to backend 
            //URL (the signup endpoint build)
            // formData = the data were sending (email,password, names)
            // await = wait for backend to respond before continuing 
            // response = what backend sends back
            const response = await axios.post('http://localhost:3001/api/auth/signup', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            //What the backend sends back:
            /*
            {
              "message": "User cerated successfully"
              "user": {...},
              "token": "eyJhbGc..."
            }
            */  


            //Save token to localStorage

            //Save the JWT token (proves user is logged in)
            //Save user info (email, name , etc)
            //JSON.stringify() = converts objects to text format for storage
            //WHY? so user stays logged in even if they refresh the page!
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            //Call callback
            onSignupSuccess(response.data.user);
        }catch (err){
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          FinFlow
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Create your account
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="karim@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* First Name Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Karim"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Farag"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
  
}
