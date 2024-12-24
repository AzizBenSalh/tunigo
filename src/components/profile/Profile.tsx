import {
  MapPin,
  Flag,
  User as UserIcon,
  Briefcase,
  ArrowLeft,
  Camera,
  Trash2,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DestinationList from "../discover/DestinationList";
import { useFavorites } from "@/contexts/FavoritesContext";
import { destinations } from "@/data/destinations";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
  "https://dummyimage.com/200x200/cccccc/ffffff&text=User";

const Profile = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const favoriteDestinations = favorites
    .map((id) => destinations[id])
    .filter(Boolean);

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    photoURL: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_IMAGE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('====================================');
        console.log("yoyo",user);
        console.log('====================================');
        const userProfile = {
          name: user.displayName || "Nom non défini",
          email: user.email || "Email non défini",
          photoURL: user.photoURL || DEFAULT_PROFILE_IMAGE,
        };
        setProfile(userProfile);
        setProfileImage(userProfile.photoURL || DEFAULT_PROFILE_IMAGE);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(DEFAULT_PROFILE_IMAGE);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDisconnect = () => {
    auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barre de navigation */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-white z-50 shadow-sm w-full max-w-[390px]">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">Profil</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleDisconnect}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pt-16 pb-20">
        {profile ? (
          <>
            {/* Image et infos utilisateur */}
            <div className="flex flex-col items-center px-4 py-6 bg-gray-50">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={profileImage}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-0 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  {profileImage !== DEFAULT_PROFILE_IMAGE && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
              <h1 className="text-xl font-semibold text-center">{profile.name}</h1>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>

            {/* Onglets */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-2 sticky top-[64px] bg-white z-40">
                <TabsTrigger value="info">Infos</TabsTrigger>
                <TabsTrigger value="favorites">Favoris</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-6 px-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{profile.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Marsa</span>
                  </div>
                  <div className="flex items-center gap-3">
  <Flag className="h-5 w-5 text-gray-400" />
  <span className="text-gray-600">Tunisien</span>
</div>

                </div>
              </TabsContent>

              <TabsContent value="favorites" className="mt-6 px-4">
                <DestinationList destinations={favoriteDestinations} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center px-4 py-12 bg-gray-50">
            <h1 className="text-xl font-semibold text-center mb-2">
              Aucun profil trouvé
            </h1>
            <p className="text-sm text-gray-500 text-center">
              Veuillez vous connecter pour afficher votre profil.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
