"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {   CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MessageCircle } from "lucide-react";

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you shortly.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-[#121212] text-gray-100">
      {/* Hero */}
      <header className="relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#008068] to-[#121212] opacity-90" />
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-10 px-6"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4 leading-tight">
            Communicate Better with
            <span className="text-[#00a87e]"> Odix</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Empowering you to record, share, and collaborate seamlessly with your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button className="px-8 py-3 text-lg rounded-2xl bg-gradient-to-r from-[#00a87e] to-[#00d293] shadow-lg hover:scale-105 transform-gpu transition">
                Get Started Free
              </Button>
            </Link>
            <Link href="/features">
              <Button className="px-8 py-3 text-lg rounded-2xl bg-gray-800 hover:bg-gray-700 transition">
                Explore Features
              </Button>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-0 w-full h-64 bg-[url('/waves.svg')] bg-cover bg-bottom pointer-events-none"
        />
      </header>

      {/* Features */}
      <section className="py-24 px-6 lg:px-32 bg-[#1e1e1e]">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Why Choose <span className="text-[#00a87e]">Odix?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "/record.svg", title: "Easy Recording", desc: "Record screen, webcam, or both with one click." },
            { icon: "/share.svg", title: "Seamless Sharing", desc: "Share instantly via link or embed anywhere." },
            { icon: "/analyze.svg", title: "Insights & Feedback", desc: "Get realtime analytics to improve communications." },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center p-6 bg-[#121212] rounded-2xl shadow-md"
            >
              <Image src={feature.icon} alt={feature.title} width={80} height={80} />
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-300 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="#pricing" className="py-24 px-6 lg:px-32 bg-[#121212]">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Free", price: "$0/mo", features: ["Unlimited recordings", "Basic sharing", "Community support"], featured: false },
            { name: "Pro", price: "$40/mo", features: ["All Free features", "Advanced sharing", "Priority email support"], featured: true },
            { name: "Enterprise", price: "Custom", features: ["All Pro features", "Dedicated support", "Custom integrations"], featured: false },
          ].map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-2xl shadow-lg border ${
                plan.featured ? "border-[#00a87e] bg-[#1e1e1e] scale-105" : "border-gray-700 bg-[#1e1e1e]"
              } transition-transform`}
            >
              <CardHeader className="mb-6 text-center">
                <CardTitle className="text-2xl font-bold">{plan.name} Plan</CardTitle>
                <span className="text-gray-400 text-lg">{plan.price}</span>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6 text-gray-300">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-3 rounded-2xl ${
                    plan.featured
                      ? "bg-gradient-to-r from-[#00a87e] to-[#00d293] hover:scale-105"
                      : "bg-[#00a87e] hover:bg-[#00d293]"
                  } transition`}
                >
                  {plan.featured ? "Upgrade Now" : plan.name === "Free" ? "Get Started" : "Contact Sales"}
                </Button>
              </CardContent>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="#contact" className="py-24 px-6 lg:px-32 bg-[#1e1e1e]">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Contact Us</h2>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center bg-[#121212] rounded-lg p-4 shadow-inner">
            <User className="mr-3 text-[#00a87e]" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none text-gray-100 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center bg-[#121212] rounded-lg p-4 shadow-inner">
            <Mail className="mr-3 text-[#00a87e]" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none text-gray-100 placeholder-gray-500"
            />
          </div>
          <div className="flex items-start bg-[#121212] rounded-lg p-4 shadow-inner">
            <MessageCircle className="mr-3 mt-2 text-[#00a87e]" />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              className="w-full bg-transparent resize-none focus:outline-none text-gray-100 placeholder-gray-500"
            />
          </div>
          <Button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00a87e] to-[#00d293] hover:scale-105 transition">
            Send Message
          </Button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-[#252525] text-gray-400 py-6">
  <div className="container mx-auto flex flex-col items-center gap-4 px-4">
   
    <p className="text-sm text-center">
      &copy; 2025 Odix. All rights reserved.
    </p>

    
    <div className="flex gap-4">
     
      <a
        href="https://www.facebook.com/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#00a87e] transition"
        aria-label="Facebook"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.985H7.898v-2.893h2.54V9.797c0-2.507 1.493-3.89 3.778-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.628.772-1.628 1.562v1.875h2.77l-.443 2.893h-2.327v6.985C18.343 21.128 22 16.991 22 12z" />
        </svg>
      </a>

     
      <a
        href="https://www.twitter.com/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#00a87e] transition"
        aria-label="Twitter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557a9.834 9.834 0 01-2.827.775 4.933 4.933 0 002.165-2.723 9.865 9.865 0 01-3.127 1.194 4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.671 3.15a4.92 4.92 0 001.524 6.573 4.904 4.904 0 01-2.228-.616c-.054 2.28 1.581 4.415 3.95 4.89a4.935 4.935 0 01-2.224.085 4.93 4.93 0 004.604 3.417A9.867 9.867 0 010 19.54a13.924 13.924 0 007.548 2.212c9.058 0 14.01-7.514 14.01-14.01 0-.213-.005-.425-.014-.637A10.012 10.012 0 0024 4.557z" />
        </svg>
      </a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default LandingPage;
