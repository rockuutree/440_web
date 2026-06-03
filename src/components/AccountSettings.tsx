import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, X, Upload, Shield, MapPin, User, Mail } from 'lucide-react';

interface AccountSettingsProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onCancel: () => void;
}

export default function AccountSettings({ profile, onSave, onCancel }: AccountSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [voiceType, setVoiceType] = useState(profile.voiceType);
  const [age, setAge] = useState(profile.age);
  const [location, setLocation] = useState(profile.location);
  const [password, setPassword] = useState("••••••••••••");
  const [email, setEmail] = useState("username@address.com");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(profile.resumeUrl || "soprano_resume_2026.pdf");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      name,
      voiceType,
      age: Number(age),
      location,
      resumeUrl: fileName,
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-amber-50/40 p-6 md:p-8 rounded-3xl border border-amber-200/60 shadow-xl backdrop-blur-sm" id="settings-container">
      <div className="flex items-center justify-between pb-6 border-b border-amber-200/50 mb-6">
        <div>
          <h2 className="text-2xl font-serif text-slate-800 font-semibold tracking-tight">Your Account Settings</h2>
          <p className="text-xs text-slate-500 font-mono mt-1">Configure vocal credentials and profile details</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          id="btn-settings-cancel"
          aria-label="Cancel settings"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Preview */}
        <div className="flex items-center space-x-4 bg-white/70 p-4 rounded-2xl border border-amber-200/30">
          <img 
            src={profile.avatarUrl} 
            alt={profile.name} 
            className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover shadow-sm"
          />
          <div>
            <h3 className="font-serif text-slate-800 font-semibold">{profile.name}</h3>
            <p className="text-xs text-slate-500">{profile.voiceType} · {profile.location}</p>
          </div>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 font-serif block">Your Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600/70">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
                required
                placeholder="Vocalist Name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 font-serif block">Vocal Classification</label>
            <select
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
            >
              <option value="Coloratura Soprano">Coloratura Soprano</option>
              <option value="Lyric Soprano">Lyric Soprano</option>
              <option value="Mezzo-Soprano">Mezzo-Soprano</option>
              <option value="Contralto">Contralto</option>
              <option value="Countertenor">Countertenor</option>
              <option value="Tenor">Tenor</option>
              <option value="Baritone">Baritone</option>
              <option value="Bass">Bass</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 font-serif block">Age</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              required
              min="10"
              max="120"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 font-serif block">Location</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600/70">
                <MapPin className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                required
                placeholder="Seattle, WA"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 font-serif block">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600/70">
              <Mail className="w-4 h-4" />
            </span>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 font-serif block">Account Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600/70">
              <Shield className="w-4 h-4" />
            </span>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Drag and Drop Resume */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 font-serif block">Vocal Resume & Repertoire Profile</label>
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 transition-all text-center flex flex-col items-center justify-center bg-white/50 ${
              dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-amber-200/80 hover:border-amber-400'
            }`}
          >
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-700">
                <span className="text-amber-800 font-semibold hover:underline">Click to upload</span> or drag and drop files here
              </p>
              <p className="text-[10px] text-slate-400 font-mono">PDF, DOC up to 5MB</p>
            </label>
          </div>

          {fileName && (
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-100 shadow-xs text-xs mt-2">
              <span className="text-slate-600 truncate max-w-[80%] font-mono">{fileName}</span>
              <button 
                type="button" 
                onClick={() => setFileName('')}
                className="text-amber-800 hover:text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Form buttons */}
        <div className="flex space-x-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 font-serif text-slate-700 text-sm hover:bg-slate-50 transition-colors"
            id="btn-settings-cancel-form"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-serif rounded-xl text-sm font-medium hover:from-amber-800 hover:to-amber-900 shadow-md transition-all flex items-center justify-center space-x-2"
            id="btn-settings-save"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
