
import { TalentData } from '@/types/talent';

const CREME_TALENT_EMAIL = "Cremetalentafrica@gmail.com";

// Helper function to simulate sending an email notification
export const sendNotificationEmail = (email: string, subject: string, message: string) => {
  console.log(`Sending email to: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  // In a real application, you would integrate with an email service
  // This is just a placeholder for demonstration purposes
};

// Function to send notification to CremeTalent admin
export const sendAdminNotification = (subject: string, message: string) => {
  sendNotificationEmail(CREME_TALENT_EMAIL, subject, message);
};

export const loadTalentData = () => {
  let pendingTalent: TalentData[] = [];
  let approvedTalent: TalentData[] = [];
  let rejectedTalent: TalentData[] = [];

  try {
    // Load pending applications
    const pendingApps = localStorage.getItem('pendingTalentApplications');
    if (pendingApps) {
      const applications = JSON.parse(pendingApps);
      const formattedApplications = applications.map((app: any, index: number) => ({
        id: index + 1000, // Use a different ID range for pending applications
        name: `${app.firstName} ${app.lastName}`,
        photo: null,
        location: `${app.city}, ${app.country}`,
        category: app.specialization,
        experience: app.experienceLevel,
        availability: app.availability,
        bio: app.bio,
        skills: app.skills.split(',').map((skill: string) => skill.trim()),
        portfolio: [app.portfolioUrl],
        email: app.email,
        status: "Pending",
        notes: "",
        matchScore: 0,
        lastContact: new Date().toISOString().split('T')[0]
      }));
      
      pendingTalent = formattedApplications;
    }
    
    // Load approved talent
    const approvedApps = localStorage.getItem('talentApplications');
    if (approvedApps) {
      const applications = JSON.parse(approvedApps);
      const formattedApplications = applications.map((app: any, index: number) => ({
        id: index + 1,
        name: `${app.firstName} ${app.lastName}`,
        photo: null,
        location: `${app.city}, ${app.country}`,
        category: app.specialization,
        experience: app.experienceLevel,
        availability: app.availability,
        bio: app.bio,
        skills: app.skills.split(',').map((skill: string) => skill.trim()),
        portfolio: [app.portfolioUrl],
        email: app.email,
        status: "Active",
        notes: "",
        matchScore: 0,
        lastContact: new Date().toISOString().split('T')[0]
      }));
      
      approvedTalent = formattedApplications;
    }
    
    // Load rejected applications
    const rejectedApps = localStorage.getItem('rejectedTalentApplications');
    if (rejectedApps) {
      const applications = JSON.parse(rejectedApps);
      const formattedApplications = applications.map((app: any, index: number) => ({
        id: index + 2000, // Use a different ID range for rejected applications
        name: `${app.firstName} ${app.lastName}`,
        photo: null,
        location: `${app.city}, ${app.country}`,
        category: app.specialization,
        experience: app.experienceLevel,
        availability: app.availability,
        bio: app.bio,
        skills: app.skills.split(',').map((skill: string) => skill.trim()),
        portfolio: [app.portfolioUrl],
        email: app.email,
        status: "Rejected",
        notes: app.rejectionReason || "",
        matchScore: 0,
        lastContact: new Date().toISOString().split('T')[0]
      }));
      
      rejectedTalent = formattedApplications;
    }

  } catch (error) {
    console.error("Error loading applications:", error);
  }

  return { pendingTalent, approvedTalent, rejectedTalent };
};

export const approveTalent = (talent: TalentData, pendingTalent: TalentData[]) => {
  try {
    // Remove from pending list
    const newPendingList = pendingTalent.filter(item => item.id !== talent.id);
    localStorage.setItem('pendingTalentApplications', JSON.stringify(
      newPendingList.map(item => {
        // Convert back to application format for storage
        return {
          firstName: item.name.split(' ')[0],
          lastName: item.name.split(' ')[1] || '',
          email: item.email,
          city: item.location.split(',')[0].trim(),
          country: item.location.split(',')[1]?.trim() || '',
          specialization: item.category,
          experienceLevel: item.experience,
          availability: item.availability,
          bio: item.bio,
          skills: item.skills.join(', '),
          portfolioUrl: item.portfolio[0] || '',
        };
      })
    ));
    
    // Add to approved list
    const existingApproved = localStorage.getItem('talentApplications');
    const approvedList = existingApproved ? JSON.parse(existingApproved) : [];
    
    // Convert TalentData back to application format
    const applicationData = {
      firstName: talent.name.split(' ')[0],
      lastName: talent.name.split(' ')[1] || '',
      email: talent.email,
      city: talent.location.split(',')[0].trim(),
      country: talent.location.split(',')[1]?.trim() || '',
      specialization: talent.category,
      experienceLevel: talent.experience,
      availability: talent.availability,
      bio: talent.bio,
      skills: talent.skills.join(', '),
      portfolioUrl: talent.portfolio[0] || '',
      phone: '', // These fields might not exist in TalentData
      linkedin: '',
      instagram: '',
      twitter: '',
      heardFrom: '',
      acceptTerms: true
    };
    
    approvedList.push(applicationData);
    localStorage.setItem('talentApplications', JSON.stringify(approvedList));
    
    // Send approval notification email
    sendNotificationEmail(talent.email, "Application Approved", 
      `Congratulations! Your application to join the CrémeTalent talent pool has been approved. 
       Your profile is now visible in our talent pool.`);
    
    // Notify admin about the approval
    sendAdminNotification("Talent Application Approved", 
      `A talent application has been approved:
       Name: ${talent.name}
       Email: ${talent.email}
       Category: ${talent.category}`);
    
    return { newPendingList, talent };
  } catch (error) {
    console.error("Error approving application:", error);
    throw error;
  }
};

export const rejectTalent = (talent: TalentData, rejectionReason: string, pendingTalent: TalentData[]) => {
  try {
    // Remove from pending list
    const newPendingList = pendingTalent.filter(item => item.id !== talent.id);
    localStorage.setItem('pendingTalentApplications', JSON.stringify(
      newPendingList.map(item => {
        // Convert back to application format for storage
        return {
          firstName: item.name.split(' ')[0],
          lastName: item.name.split(' ')[1] || '',
          email: item.email,
          city: item.location.split(',')[0].trim(),
          country: item.location.split(',')[1]?.trim() || '',
          specialization: item.category,
          experienceLevel: item.experience,
          availability: item.availability,
          bio: item.bio,
          skills: item.skills.join(', '),
          portfolioUrl: item.portfolio[0] || '',
        };
      })
    ));
    
    // Add to rejected list
    const existingRejected = localStorage.getItem('rejectedTalentApplications');
    const rejectedList = existingRejected ? JSON.parse(existingRejected) : [];
    
    // Convert TalentData back to application format with rejection reason
    const applicationData = {
      firstName: talent.name.split(' ')[0],
      lastName: talent.name.split(' ')[1] || '',
      email: talent.email,
      city: talent.location.split(',')[0].trim(),
      country: talent.location.split(',')[1]?.trim() || '',
      specialization: talent.category,
      experienceLevel: talent.experience,
      availability: talent.availability,
      bio: talent.bio,
      skills: talent.skills.join(', '),
      portfolioUrl: talent.portfolio[0] || '',
      rejectionReason: rejectionReason,
      phone: '', // These fields might not exist in TalentData
      linkedin: '',
      instagram: '',
      twitter: '',
      heardFrom: '',
      acceptTerms: true
    };
    
    rejectedList.push(applicationData);
    localStorage.setItem('rejectedTalentApplications', JSON.stringify(rejectedList));
    
    // Send rejection notification email
    sendNotificationEmail(talent.email, "Application Status Update", 
      `Thank you for your interest in joining the CrémeTalent talent pool. 
       After careful review, we regret to inform you that we are unable to accept your application at this time. 
       ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`);
    
    // Notify admin about the rejection
    sendAdminNotification("Talent Application Rejected", 
      `A talent application has been rejected:
       Name: ${talent.name}
       Email: ${talent.email}
       Reason: ${rejectionReason || "No reason provided"}`);
    
    // Create rejected talent data object
    const rejectedTalentData = {
      ...talent,
      status: "Rejected",
      notes: rejectionReason
    };
    
    return { newPendingList, rejectedTalentData };
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw error;
  }
};
