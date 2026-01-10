import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async (formData) => {
        set({ loading: true });

        if(formData.password !== formData.confirmPassword){
            set({ loading: false });
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = await axiosInstance.post("/auth/signup", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

      console.log("Backend response:", res.data);  
            set({ user: res.data.user, loading: false });
            toast.success('Account created successfully!');
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axiosInstance.post("/auth/login", { email, password });

			set({ user: res.data.user, loading: false });
            toast.success("Login Successful")
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

checkAuth: async () => {
    set({checkingAuth: true});
    try {
        const response = await axiosInstance.get("/auth/profile");
        set({ user: response.data.user, checkingAuth: false})
    } catch (error) {
        set({checkingAuth: false, user: null})
    }
}

}))