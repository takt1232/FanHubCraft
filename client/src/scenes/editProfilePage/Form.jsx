/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state";
import DialogMessage from "components/DialogMessage";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  location: yup.string().required("required"),
  picturePath: yup.string().required("required"),
  picture: yup.string().optional(),
});

const Form = () => {
  const { palette } = useTheme();
  const theme = useTheme();
  const medium = palette.neutral.medium;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [uploadedPicturePath, setUploadedPicturePath] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingAnimation, setLoadingAnimation] = useState(true);

  const [dialogAction, setDialogAction] = useState(false);

  const initialValuesRegister = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    location: user.location,
    picturePath: user.picturePath,
    picture: "",
  };

  const handleImageSelect = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("picture", file);
      formData.append("picturePath", file.name);

      const response = await fetch(`http://localhost:3001/upload/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        // You might need to handle progress events here
      });

      if (response.ok) {
        // Handle successful upload, update UI with the uploaded image
        const uploadedImage = await response.json();
        setUploadedPicturePath(uploadedImage);
        setLoading(false);
      }
    }
  };

  const updateProfile = async (values, onSubmitProps) => {
    setLoading(true);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const response = await fetch(
      `http://localhost:3001/users/${user._id}/update`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const updatedUser = await response.json();
    dispatch(setUser({ user: updatedUser }));
    setLoading(false);
    setDialogAction(true);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    updateProfile(values, onSubmitProps);
  };

  const handleCloseSuccessDialog = () => {
    setDialogAction(false);
  };

  useEffect(() => {
    // Create an interval to toggle the loading animation
    const interval = setInterval(() => {
      setLoadingAnimation((prev) => !prev);
    }, 200); // Change the value to set the interval duration

    // Clear the interval when component unmounts or when the data fetching is done
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <Box display="flex" justifyContent="center">
            <Box
              display="flex"
              justifyContent="center"
              width="90%"
              height="100%"
              mt="2rem"
              gap="1rem"
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="center"
                gap="2rem"
              >
                <Box
                  border={`1px solid ${medium}`}
                  borderRadius="5px"
                  p="1rem"
                  width="200px"
                  height="200px"
                >
                  {uploadedPicturePath ? (
                    <img
                      src={`http://localhost:3001/assets/${uploadedPicturePath}`}
                      alt="Uploaded"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : user.picturePath ? (
                    <img
                      src={`http://localhost:3001/assets/${user.picturePath}`}
                      alt="Uploaded"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                    >
                      <Typography>No Picture</Typography>
                    </Box>
                  )}
                </Box>
                <label
                  htmlFor="upload-image-edit"
                  style={{ cursor: "pointer" }}
                >
                  <FlexBetween gap="0.25rem">
                    <Typography
                      color={palette.background.alt}
                      backgroundColor={palette.primary.main}
                      padding="0.5rem"
                      borderRadius="5px"
                      sx={{
                        "&:hover": { cursor: "pointer", color: medium },
                      }}
                    >
                      Change Profile
                    </Typography>
                  </FlexBetween>
                </label>
                <input
                  id="upload-image-edit"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    handleImageSelect(e);
                    setFieldValue("picture", e.target.files[0]);
                    setFieldValue("picturePath", e.target.files[0].name);
                  }}
                  style={{ display: "none" }}
                />
              </Box>
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />

                  <TextField
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />
                </Box>

                {/* BUTTONS */}
                <Box>
                  <Button
                    fullWidth
                    type="submit"
                    sx={{
                      m: "2rem 0",
                      p: "1rem",
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      "&:hover": { color: palette.primary.main },
                    }}
                  >
                    EDIT
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        )}
      </Formik>
      {loading && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          borderRadius="10px"
          width="400px"
          height="auto"
          backgroundColor={theme.palette.background.alt}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            marginBottom="1rem"
          >
            <Typography>Loading Please wait...</Typography>
            {loadingAnimation ? (
              <HourglassTopIcon color="primary" fontSize="large" />
            ) : (
              <HourglassBottomIcon color="primary" fontSize="large" />
            )}
          </Box>
        </Box>
      )}
      <DialogMessage
        open={dialogAction}
        handleClose={handleCloseSuccessDialog}
        title="Edit Successful"
        content="Your profile was successfully edited!"
      />
    </>
  );
};

export default Form;
