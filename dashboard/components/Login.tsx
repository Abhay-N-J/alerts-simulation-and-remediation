"use client";
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner"


interface UserDetails {
  First_name: string;
  Last_name: string;
  Email: string;
  Password: string;
  Phone: string;
}

const LoginRegisterForm = () => {
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [formData, setFormData] = useState<UserDetails>({
    First_name: '',
    Last_name: '',
    Email: '',
    Password: '',
    Phone: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const endpoint = isRegisterForm ? '/users/signup' : '/users/login';
      const body = isRegisterForm
        ? JSON.stringify({
            First_name: formData.First_name,
            Last_name: formData.Last_name,
            Email: formData.Email,
            Password: formData.Password,
            Phone: formData.Phone,
            User_type: 'USER'
          })
        : JSON.stringify({
            Email: formData.Email,
            Password: formData.Password,
          });
  
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
  
      let data;
      const contentType = response.headers.get('Content-Type');
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
  
      console.log(data);
      if (response.ok) {
        if (isRegisterForm) {
          // Registration successful, navigate to /login
          sessionStorage.setItem('token', data.token);

          window.location.href = "/home";
        } else {
          // Login successful, navigate to /home
          sessionStorage.setItem('token', data.token);
          window.location.href = "/home";
        }
      } else {
        // Invalid credentials or registration failed
        toast.error(data.error);
        setErrorMessage(data.message || 'An error occurred during the request' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred during the request\n' + error);
    }
  };

  const toggleForm = () => {
    setIsRegisterForm((prevState) => !prevState);
    setFormData({
      First_name: '',
      Last_name: '',
      Email: '',
      Password: '',
      Phone: '',
    });
    setErrorMessage('');
  };

  return (
    <div className="max-w-xl w-full mx-auto p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">
        Welcome to <span className='text-red-500 block'>Alerts Simulation & Remediation</span>
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        {isRegisterForm ? 'Create your account' : 'Login to your account'}
      </p>
      {errorMessage && (
        <div className='text-red-500 text-sm mt-2'>{errorMessage}</div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        {isRegisterForm && (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="Tyler"
                type="text"
                name="First_name"
                value={formData.First_name}
                onChange={handleChange}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Durden"
                type="text"
                name="Last_name"
                value={formData.Last_name}
                onChange={handleChange}
              />
            </LabelInputContainer>
          </div>
        )}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
          />
        </LabelInputContainer>
        {isRegisterForm && (
          <LabelInputContainer className="mb-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="555-555-5555"
              type="text"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
            />
          </LabelInputContainer>
        )}
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {isRegisterForm ? 'Register' : 'Login'}
          <BottomGradient />
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
            onClick={toggleForm}
          >
            {isRegisterForm
              ? 'Already have an account? Login'
              : 'Don\'t have an account? Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default LoginRegisterForm;