import { motion } from 'framer-motion';
import { useState } from 'react';
import { createPod } from '../../../utils/db/action.js';

// Custom Alert Component
const Alert = ({ type, message, onClose }) => {
    const alertStyles = {
        success: 'bg-green-500 border-green-700',
        error: 'bg-red-500 border-red-700',
        warning: 'bg-yellow-500 border-yellow-700'
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`
                fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl 
                text-white flex items-center justify-between
                ${alertStyles[type]} 
                transform transition-all duration-300
            `}
        >
            <div className="flex items-center">
                {type === 'success' && (
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <span className="font-bold">{message}</span>
            </div>
            <button 
                onClick={onClose} 
                className="ml-4 hover:bg-white/20 rounded-full p-1 transition"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </motion.div>
    );
};

const CreatePod = () => {
    // State Management
    const [description, setDescription] = useState('');
    const [domain, setDomain] = useState('');
    const [subtag, setSubtag] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [alert, setAlert] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation Function
    const validateForm = () => {
        if (!description.trim()) {
            showAlert('error', 'Describe your pod, Chad!');
            return false;
        }
        if (!domain) {
            showAlert('error', 'Choose a domain, Legend!');
            return false;
        }
        if (!subtag) {
            showAlert('error', 'Pick a subtag, Warrior!');
            return false;
        }
        return true;
    };

    // Alert Handler
    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 3000);
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const newPod = await createPod({
                admin_id: 3,
                is_public: isPublic,
                subtag,
                domain,
                description,
            });

            showAlert('success', 'Pod Created like a BOSS! 💪');
            
            // Reset form
            setDescription('');
            setDomain('');
            setSubtag('');
        } catch (error) {
            showAlert('error', 'Pod Creation Failed. Try Again, Warrior!');
            console.error('Pod Creation Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            {/* Alert Render */}
            {alert && (
                <Alert 
                    type={alert.type} 
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 w-full max-w-md p-8 rounded-xl shadow-2xl"
            >
                <h1 className="text-2xl font-bold text-white text-center mb-6">
                    Create Your Epic Pod 🚀
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Description Input */}
                    <textarea
                        placeholder="Describe your pod's vibe..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition"
                        rows={3}
                    />

                    {/* Domain Selection */}
                    <div>
                        <p className="text-gray-300 mb-2">Choose Your Domain</p>
                        <div className="grid grid-cols-4 gap-2">
                            {['Tech', 'Anime', 'Music', 'Other'].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setDomain(item)}
                                    className={`
                                        py-2 rounded-lg transition 
                                        ${domain === item 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subtag Selection */}
                    <div>
                        <p className="text-gray-300 mb-2">Pick Your Vibe</p>
                        <div className="grid grid-cols-4 gap-2">
                            {['Happy', 'Sad', 'Fun', 'Serious'].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setSubtag(item)}
                                    className={`
                                        py-2 rounded-lg transition 
                                        ${subtag === item 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center">
                        <input 
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => setIsPublic(!isPublic)}
                            className="mr-2 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-300"> Public</span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 rounded-lg transition ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Pod'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreatePod;