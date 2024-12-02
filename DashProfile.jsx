/* eslint-disable no-undef */
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from "../firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link} from 'react-router-dom';

export default function DashProfile() {
  
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    profilePicture: currentUser?.photoURL || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const filePickerRef = useRef();

  // Load user data on initial render
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        password: "",
        profilePicture: currentUser.photoURL || "",
      });
      setImageFileUrl(currentUser.photoURL || ""); 
    }
  }, [currentUser]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // Preview image before upload
    }
  };

  // Upload image to Firebase Storage
  useEffect(() => {
    if (imageFile) {
      uploadImage(); // Trigger image upload when imageFile is set
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setIsUploading(true); // Mark uploading as started

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload image');
        setImageFileUploadProgress(0);
        setIsUploading(false); // Reset uploading state
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData((prevData) => ({ ...prevData, profilePicture: downloadURL }));
          setIsUploading(false); // Mark uploading as finished
          updateFirebaseProfile(downloadURL); // Update profile picture in Firebase
          dispatch(updateUserSuccess({ ...currentUser, photoURL: downloadURL })); // Update Redux store
        });
      }
    );
  };

  // Update profile picture in Firebase Auth
  const updateFirebaseProfile = async (downloadURL) => {
    const auth = getAuth();
    try {
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are changes in form data
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }

    // Check if image is still uploading
    if (isUploading) {
      setUpdateUserError('Please wait for the image to upload');
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  // Handle account deletion
  const handleDeleteUser = async () => {
    setShowModal(false); // Close the modal
  
    try {
      // Dispatch the start action before making the request
      dispatch(deleteUserStart());
  
      // Make the DELETE request to the API
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
  
      // Check if the response is successful
      if (!res.ok) {
        // If not, parse and dispatch the error message
        const data = await res.json();
        dispatch(deleteUserFailure(data.message || 'Failed to delete user'));
      } else {
        // If successful, parse the response and dispatch success
        const data = await res.json();
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      // Handle any network or unexpected errors
      dispatch(deleteUserFailure(error.message || 'An unexpected error occurred'));
    }
  };
  
  // Handle sign-out
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
  
      // Kiểm tra mã trạng thái HTTP (200-299 là OK)
      const data = await res.json();
  
      if (!res.ok) {
        // Nếu phản hồi không thành công, ghi lại thông báo lỗi
        console.log(data.message || 'Something went wrong during signout');
        alert(data.message || 'Something went wrong during signout'); // Thông báo cho người dùng
      } else {
        // Nếu thành công, cập nhật Redux và chuyển hướng người dùng
        dispatch(signoutSuccess());
       
      }
    } catch (error) {
      console.log(error.message);
     
    }
  };
  
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress > 0 && imageFileUploadProgress < 100 && (
            <CircularProgressbar
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
                path: { stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})` },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.photoURL || 'default-avatar.png'}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading || isUploading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignout} className="cursor-pointer">Sign out</span>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
              <Button onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
