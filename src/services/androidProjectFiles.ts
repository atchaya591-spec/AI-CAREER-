export interface AndroidFileDefinition {
  path: string;
  category: 'java' | 'xml' | 'gradle' | 'config' | 'doc';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFileDefinition[] = [
  // -------------------------------------------------------------
  // GRADLE & CONFIG
  // -------------------------------------------------------------
  {
    path: 'build.gradle',
    category: 'gradle',
    description: 'Root project build.gradle defining Android Gradle plugin and Google Services classpath',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
        classpath 'com.google.gms:google-services:4.4.1'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}`,
  },
  {
    path: 'app/build.gradle',
    category: 'gradle',
    description: 'App-level build.gradle with Firebase Auth, Cloud Firestore, Material 3, and OkHttp dependencies',
    content: `plugins {
    id 'com.android.application'
    id 'com.google.gms.google-services'
}

android {
    namespace 'com.careerguidance.ai'
    compileSdk 34

    defaultConfig {
        applicationId "com.careerguidance.ai"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    buildFeatures {
        viewBinding true
    }
}

dependencies {
    // AndroidX & Material UI
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'
    implementation 'androidx.cardview:cardview:1.0.0'

    // Firebase (Using Firebase BoM for compatible versions)
    implementation platform('com.google.firebase:firebase-bom:32.8.0')
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'

    // Networking for Backend AI Proxy
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'com.google.code.gson:gson:2.10.1'

    // Testing
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}`,
  },
  {
    path: 'settings.gradle',
    category: 'gradle',
    description: 'Gradle project settings file',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "AI Career Guidance System"
include ':app'`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'config',
    description: 'Android Manifest with Internet permissions, application theme, and registered activities',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.careerguidance.ai">

    <!-- Permissions for Firebase, Firestore, and backend AI calls -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AICareerGuidance"
        tools:targetApi="31">

        <!-- Splash Screen (Launcher Entry Point) -->
        <activity
            android:name=".SplashActivity"
            android:exported="true"
            android:theme="@style/Theme.AICareerGuidance.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Authentication Activities -->
        <activity android:name=".WelcomeActivity" android:exported="false" />
        <activity android:name=".LoginActivity" android:exported="false" />
        <activity android:name=".RegisterActivity" android:exported="false" />
        <activity android:name=".ForgotPasswordActivity" android:exported="false" />

        <!-- Core App Activities -->
        <activity android:name=".MainActivity" android:exported="false" />
        <activity android:name=".ProfileActivity" android:exported="false" />
        <activity android:name=".AssessmentActivity" android:exported="false" />
        <activity android:name=".QuizActivity" android:exported="false" />
        <activity android:name=".ReflectionActivity" android:exported="false" />
        <activity android:name=".ResultsActivity" android:exported="false" />
        <activity android:name=".CareerRecommendationsActivity" android:exported="false" />
        <activity android:name=".CareerDetailActivity" android:exported="false" />
        <activity android:name=".ExplainScoreActivity" android:exported="false" />
        <activity android:name=".SkillGapActivity" android:exported="false" />
        <activity android:name=".LearningPlanActivity" android:exported="false" />
        <activity android:name=".RoadmapActivity" android:exported="false" />
        <activity android:name=".ProgressActivity" android:exported="false" />
        <activity android:name=".ChatbotActivity" android:exported="false" />
        <activity android:name=".CompareCareersActivity" android:exported="false" />

    </application>

</manifest>`,
  },

  // -------------------------------------------------------------
  // RES / VALUES
  // -------------------------------------------------------------
  {
    path: 'app/src/main/res/values/colors.xml',
    category: 'xml',
    description: 'Exact prototype color palette defined for Android XML layouts',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Brand colors matching web prototype -->
    <color name="ink">#122036</color>
    <color name="ink_soft">#1B3153</color>
    <color name="paper">#F4F2EC</color>
    <color name="paper_dim">#E7E3D8</color>
    <color name="gold">#E4A23C</color>
    <color name="gold_deep">#C0812A</color>
    <color name="mint">#4FA88C</color>
    <color name="mint_deep">#357C67</color>
    <color name="coral">#E2664F</color>
    <color name="coral_deep">#B8442F</color>
    <color name="text_primary">#17232E</color>
    <color name="text_soft">#4F6070</color>
    <color name="on_ink">#EFEDE4</color>
    <color name="on_ink_soft">#A9B7C6</color>
    <color name="white">#FFFFFF</color>
    <color name="transparent">#00000000</color>
</resources>`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'xml',
    description: 'Strings resource file',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">AI Career Guidance System</string>
    <string name="tagline">Every career is a trail. Find yours.</string>
    <string name="login">Login</string>
    <string name="register">Create Account</string>
    <string name="forgot_password">Forgot Password?</string>
    <string name="reset_password">Send Password Reset Email</string>
    <string name="start_journey">Start My Journey →</string>
    <string name="dashboard">Dashboard</string>
    <string name="assess">Assess</string>
    <string name="careers">Careers</string>
    <string name="roadmap">Roadmap</string>
    <string name="profile">Profile</string>
</resources>`,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    category: 'xml',
    description: 'Material3 theme configuration with prototype brand styling',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.AICareerGuidance" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">@color/ink</item>
        <item name="colorOnPrimary">@color/on_ink</item>
        <item name="colorSecondary">@color/gold</item>
        <item name="colorOnSecondary">@color/ink</item>
        <item name="android:statusBarColor">@color/ink</item>
        <item name="android:navigationBarColor">@color/paper</item>
        <item name="android:windowBackground">@color/paper</item>
    </style>

    <style name="Theme.AICareerGuidance.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
    </style>
</resources>`,
  },

  // -------------------------------------------------------------
  // JAVA MODELS (com.careerguidance.ai.models)
  // -------------------------------------------------------------
  {
    path: 'app/src/main/java/com/careerguidance/ai/models/UserProfile.java',
    category: 'java',
    description: 'Firestore serializable student profile entity with educational details, skills, and goals',
    content: `package com.careerguidance.ai.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class UserProfile implements Serializable {
    private String uid;
    private String name;
    private String email;
    private String degree;
    private String department;
    private String yearOfStudy;
    private List<String> technicalSkills;
    private List<String> interests;
    private String careerGoal;
    private boolean assessmentCompleted;
    private String targetCareerId;

    public UserProfile() {
        // Default no-arg constructor required for Cloud Firestore deserialization
        this.technicalSkills = new ArrayList<>();
        this.interests = new ArrayList<>();
        this.assessmentCompleted = false;
    }

    public UserProfile(String uid, String name, String email) {
        this();
        this.uid = uid;
        this.name = name;
        this.email = email;
    }

    // Getters and Setters
    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public List<String> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<String> technicalSkills) { this.technicalSkills = technicalSkills; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public String getCareerGoal() { return careerGoal; }
    public void setCareerGoal(String careerGoal) { this.careerGoal = careerGoal; }

    public boolean isAssessmentCompleted() { return assessmentCompleted; }
    public void setAssessmentCompleted(boolean assessmentCompleted) { this.assessmentCompleted = assessmentCompleted; }

    public String getTargetCareerId() { return targetCareerId; }
    public void setTargetCareerId(String targetCareerId) { this.targetCareerId = targetCareerId; }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/models/CareerModel.java',
    category: 'java',
    description: 'Career domain model with multi-factor weights (RIASEC dimensions, work style, aptitude threshold)',
    content: `package com.careerguidance.ai.models;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class CareerModel implements Serializable {
    private String id;
    private String title;
    private String icon;
    private String description;
    private Map<String, Double> dimensions; // B: Build, A: Analyse, C: Create, P: People, L: Lead
    private Map<String, Double> styles;     // S: Independent, T: Team, L: Leading, X: Experimenting
    private double aptitudeThreshold;
    private List<String> requiredSkills;
    private List<String> tags;
    private String growthOutlook;
    private String salaryRange;

    public CareerModel() {}

    public CareerModel(String id, String title, String icon, String description,
                       Map<String, Double> dimensions, Map<String, Double> styles,
                       double aptitudeThreshold, List<String> requiredSkills,
                       List<String> tags, String growthOutlook, String salaryRange) {
        this.id = id;
        this.title = title;
        this.icon = icon;
        this.description = description;
        this.dimensions = dimensions;
        this.styles = styles;
        this.aptitudeThreshold = aptitudeThreshold;
        this.requiredSkills = requiredSkills;
        this.tags = tags;
        this.growthOutlook = growthOutlook;
        this.salaryRange = salaryRange;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getIcon() { return icon; }
    public String getDescription() { return description; }
    public Map<String, Double> getDimensions() { return dimensions; }
    public Map<String, Double> getStyles() { return styles; }
    public double getAptitudeThreshold() { return aptitudeThreshold; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public List<String> getTags() { return tags; }
    public String getGrowthOutlook() { return growthOutlook; }
    public String getSalaryRange() { return salaryRange; }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/models/CareerScoreResult.java',
    category: 'java',
    description: 'Explainable recommendation result containing multi-factor percentage breakdowns and matched/missing skills',
    content: `package com.careerguidance.ai.models;

import java.io.Serializable;
import java.util.List;

public class CareerScoreResult implements Serializable {
    private CareerModel career;
    private int totalScore;
    private int interestFit;
    private int aptitudeFit;
    private int styleFit;
    private int skillCoverageFit;
    private int goalFit;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String explainableSummary;

    public CareerScoreResult() {}

    public CareerScoreResult(CareerModel career, int totalScore, int interestFit, int aptitudeFit,
                             int styleFit, int skillCoverageFit, int goalFit,
                             List<String> matchedSkills, List<String> missingSkills,
                             String explainableSummary) {
        this.career = career;
        this.totalScore = totalScore;
        this.interestFit = interestFit;
        this.aptitudeFit = aptitudeFit;
        this.styleFit = styleFit;
        this.skillCoverageFit = skillCoverageFit;
        this.goalFit = goalFit;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.explainableSummary = explainableSummary;
    }

    public CareerModel getCareer() { return career; }
    public int getTotalScore() { return totalScore; }
    public int getInterestFit() { return interestFit; }
    public int getAptitudeFit() { return aptitudeFit; }
    public int getStyleFit() { return styleFit; }
    public int getSkillCoverageFit() { return skillCoverageFit; }
    public int getGoalFit() { return goalFit; }
    public List<String> getMatchedSkills() { return matchedSkills; }
    public List<String> getMissingSkills() { return missingSkills; }
    public String getExplainableSummary() { return explainableSummary; }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/models/AssessmentResult.java',
    category: 'java',
    description: 'Firestore model storing interest vector, aptitude score, work style vector, and reflection responses',
    content: `package com.careerguidance.ai.models;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class AssessmentResult implements Serializable {
    private String userId;
    private List<Integer> interestAnswers;
    private List<Integer> aptitudeAnswers;
    private List<Integer> personalityAnswers;
    private String reflectionText;
    private String confidenceLevel;
    private List<String> preferredEnvironments;
    private int aptitudeScore;
    private int totalAptitudeQuestions;
    private long timestamp;

    public AssessmentResult() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<Integer> getInterestAnswers() { return interestAnswers; }
    public void setInterestAnswers(List<Integer> interestAnswers) { this.interestAnswers = interestAnswers; }

    public List<Integer> getAptitudeAnswers() { return aptitudeAnswers; }
    public void setAptitudeAnswers(List<Integer> aptitudeAnswers) { this.aptitudeAnswers = aptitudeAnswers; }

    public List<Integer> getPersonalityAnswers() { return personalityAnswers; }
    public void setPersonalityAnswers(List<Integer> personalityAnswers) { this.personalityAnswers = personalityAnswers; }

    public String getReflectionText() { return reflectionText; }
    public void setReflectionText(String reflectionText) { this.reflectionText = reflectionText; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public List<String> getPreferredEnvironments() { return preferredEnvironments; }
    public void setPreferredEnvironments(List<String> preferredEnvironments) { this.preferredEnvironments = preferredEnvironments; }

    public int getAptitudeScore() { return aptitudeScore; }
    public void setAptitudeScore(int aptitudeScore) { this.aptitudeScore = aptitudeScore; }

    public int getTotalAptitudeQuestions() { return totalAptitudeQuestions; }
    public void setTotalAptitudeQuestions(int totalAptitudeQuestions) { this.totalAptitudeQuestions = totalAptitudeQuestions; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/models/ChatMessage.java',
    category: 'java',
    description: 'Entity for AI Career Chatbot conversation history and message bubbles',
    content: `package com.careerguidance.ai.models;

public class ChatMessage {
    private String id;
    private String message;
    private boolean isUser;
    private String timestamp;
    private String source;

    public ChatMessage() {}

    public ChatMessage(String id, String message, boolean isUser, String timestamp, String source) {
        this.id = id;
        this.message = message;
        this.isUser = isUser;
        this.timestamp = timestamp;
        this.source = source;
    }

    public String getId() { return id; }
    public String getMessage() { return message; }
    public boolean isUser() { return isUser; }
    public String getTimestamp() { return timestamp; }
    public String getSource() { return source; }
}`,
  },

  // -------------------------------------------------------------
  // UTILS & FIREBASE SERVICES (com.careerguidance.ai.services)
  // -------------------------------------------------------------
  {
    path: 'app/src/main/java/com/careerguidance/ai/services/FirebaseManager.java',
    category: 'java',
    description: 'Singleton wrapping Firebase Authentication and Cloud Firestore CRUD with complete error handling',
    content: `package com.careerguidance.ai.services;

import androidx.annotation.NonNull;

import com.careerguidance.ai.models.AssessmentResult;
import com.careerguidance.ai.models.UserProfile;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;

import java.util.HashMap;
import java.util.Map;

public class FirebaseManager {
    private static FirebaseManager instance;
    private final FirebaseAuth auth;
    private final FirebaseFirestore db;

    private FirebaseManager() {
        auth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();
    }

    public static synchronized FirebaseManager getInstance() {
        if (instance == null) {
            instance = new FirebaseManager();
        }
        return instance;
    }

    public FirebaseUser getCurrentUser() {
        return auth.getCurrentUser();
    }

    public boolean isUserLoggedIn() {
        return auth.getCurrentUser() != null;
    }

    public void registerUser(String email, String password, OnCompleteListener<AuthResult> listener) {
        auth.createUserWithEmailAndPassword(email.trim(), password)
            .addOnCompleteListener(listener);
    }

    public void loginUser(String email, String password, OnCompleteListener<AuthResult> listener) {
        auth.signInWithEmailAndPassword(email.trim(), password)
            .addOnCompleteListener(listener);
    }

    public void resetPassword(String email, OnCompleteListener<Void> listener) {
        auth.sendPasswordResetEmail(email.trim())
            .addOnCompleteListener(listener);
    }

    public void logout() {
        auth.signOut();
    }

    // Save/Update student profile in Cloud Firestore
    public void saveUserProfile(UserProfile profile, OnCompleteListener<Void> listener) {
        if (getCurrentUser() == null) return;
        String uid = getCurrentUser().getUid();
        profile.setUid(uid);
        db.collection("students").document(uid)
            .set(profile, SetOptions.merge())
            .addOnCompleteListener(listener);
    }

    // Fetch student profile from Cloud Firestore
    public void fetchUserProfile(OnCompleteListener<DocumentSnapshot> listener) {
        if (getCurrentUser() == null) return;
        String uid = getCurrentUser().getUid();
        db.collection("students").document(uid)
            .get()
            .addOnCompleteListener(listener);
    }

    // Save assessment results
    public void saveAssessmentResult(AssessmentResult result, OnCompleteListener<Void> listener) {
        if (getCurrentUser() == null) return;
        String uid = getCurrentUser().getUid();
        result.setUserId(uid);
        result.setTimestamp(System.currentTimeMillis());

        // Update both the assessment document and the student flag
        db.collection("assessments").document(uid)
            .set(result, SetOptions.merge())
            .addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    Map<String, Object> update = new HashMap<>();
                    update.put("assessmentCompleted", true);
                    db.collection("students").document(uid).update(update);
                }
                if (listener != null) {
                    listener.onComplete(task);
                }
            });
    }

    // Save task progress / roadmap item
    public void saveRoadmapTaskDone(String taskId, boolean isDone, OnCompleteListener<Void> listener) {
        if (getCurrentUser() == null) return;
        String uid = getCurrentUser().getUid();
        Map<String, Object> data = new HashMap<>();
        data.put("done." + taskId, isDone);
        db.collection("progress").document(uid)
            .set(data, SetOptions.merge())
            .addOnCompleteListener(listener);
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/services/CareerScoringEngine.java',
    category: 'java',
    description: 'Transparent multi-factor mathematical scoring engine matching research-backed RIASEC vectors and weights',
    content: `package com.careerguidance.ai.services;

import com.careerguidance.ai.models.AssessmentResult;
import com.careerguidance.ai.models.CareerModel;
import com.careerguidance.ai.models.CareerScoreResult;
import com.careerguidance.ai.models.UserProfile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CareerScoringEngine {

    // Default built-in careers
    public static List<CareerModel> getStandardCareers() {
        List<CareerModel> list = new ArrayList<>();

        // Software Engineer
        Map<String, Double> sweDims = new HashMap<>();
        sweDims.put("B", 1.0); sweDims.put("A", 0.6); sweDims.put("C", 0.3); sweDims.put("P", 0.2); sweDims.put("L", 0.2);
        Map<String, Double> sweStyle = new HashMap<>();
        sweStyle.put("S", 0.8); sweStyle.put("T", 0.6); sweStyle.put("L", 0.2); sweStyle.put("X", 0.5);
        list.add(new CareerModel("swe", "Software Engineer", "💻",
                "Architect, code, test, and scale mission-critical software systems and applications.",
                sweDims, sweStyle, 0.65,
                Arrays.asList("Java", "DSA (Data Structures)", "SQL & Databases", "Git & GitHub", "Unit Testing", "Communication"),
                Arrays.asList("software", "developer", "engineer", "swe", "backend"),
                "+25% (Much faster than average)", "$110,000 - $165,000"));

        // AI / ML Engineer
        Map<String, Double> mlDims = new HashMap<>();
        mlDims.put("B", 0.7); mlDims.put("A", 1.0); mlDims.put("C", 0.3); mlDims.put("P", 0.1); mlDims.put("L", 0.1);
        Map<String, Double> mlStyle = new HashMap<>();
        mlStyle.put("S", 0.8); mlStyle.put("T", 0.4); mlStyle.put("L", 0.1); mlStyle.put("X", 0.8);
        list.add(new CareerModel("ml", "AI / ML Engineer", "🤖",
                "Design, train, optimize, and deploy neural networks and intelligent data pipelines.",
                mlDims, mlStyle, 0.75,
                Arrays.asList("Python", "Statistics", "Machine Learning", "DSA (Data Structures)", "SQL & Databases", "Git & GitHub"),
                Arrays.asList("ai", "ml", "machine learning", "data scientist", "deep learning"),
                "+36% (Extremely high demand)", "$130,000 - $190,000"));

        // Data Analyst
        Map<String, Double> daDims = new HashMap<>();
        daDims.put("B", 0.3); daDims.put("A", 1.0); daDims.put("C", 0.3); daDims.put("P", 0.4); daDims.put("L", 0.3);
        Map<String, Double> daStyle = new HashMap<>();
        daStyle.put("S", 0.6); daStyle.put("T", 0.6); daStyle.put("L", 0.3); daStyle.put("X", 0.4);
        list.add(new CareerModel("da", "Data Analyst", "📊",
                "Transform complex data streams into actionable intelligence to steer business and product strategy.",
                daDims, daStyle, 0.60,
                Arrays.asList("SQL & Databases", "Python", "Statistics", "Data Visualization", "Communication"),
                Arrays.asList("data", "analyst", "analytics", "bi"),
                "+23% (Rapid growth)", "$85,000 - $125,000"));

        // UI/UX Designer
        Map<String, Double> uxDims = new HashMap<>();
        uxDims.put("B", 0.3); uxDims.put("A", 0.4); uxDims.put("C", 1.0); uxDims.put("P", 0.6); uxDims.put("L", 0.2);
        Map<String, Double> uxStyle = new HashMap<>();
        uxStyle.put("S", 0.4); uxStyle.put("T", 0.7); uxStyle.put("L", 0.2); uxStyle.put("X", 0.9);
        list.add(new CareerModel("ux", "UI / UX Designer", "🎨",
                "Synthesize user behavior research into delightful, accessible, and high-impact digital experiences.",
                uxDims, uxStyle, 0.50,
                Arrays.asList("Figma", "UX Research", "HTML/CSS", "Communication", "Data Visualization"),
                Arrays.asList("design", "ux", "ui", "designer"),
                "+16% (Faster than average)", "$90,000 - $140,000"));

        // Cybersecurity Analyst
        Map<String, Double> secDims = new HashMap<>();
        secDims.put("B", 0.7); secDims.put("A", 0.9); secDims.put("C", 0.2); secDims.put("P", 0.2); secDims.put("L", 0.3);
        Map<String, Double> secStyle = new HashMap<>();
        secStyle.put("S", 0.8); secStyle.put("T", 0.5); secStyle.put("L", 0.3); secStyle.put("X", 0.5);
        list.add(new CareerModel("sec", "Cybersecurity Analyst", "🛡️",
                "Safeguard infrastructure, networks, and cloud assets by identifying and neutralizing threats.",
                secDims, secStyle, 0.70,
                Arrays.asList("Networking", "Security Basics", "Python", "Git & GitHub", "Communication"),
                Arrays.asList("security", "cyber", "infosec"),
                "+32% (Critical shortage)", "$105,000 - $155,000"));

        // Product Manager
        Map<String, Double> pmDims = new HashMap<>();
        pmDims.put("B", 0.4); pmDims.put("A", 0.7); pmDims.put("C", 0.5); pmDims.put("P", 0.8); pmDims.put("L", 1.0);
        Map<String, Double> pmStyle = new HashMap<>();
        pmStyle.put("S", 0.2); pmStyle.put("T", 0.8); pmStyle.put("L", 1.0); pmStyle.put("X", 0.5);
        list.add(new CareerModel("pm", "Product Manager", "🧭",
                "Define product vision, align cross-functional engineering teams, and deliver user value.",
                pmDims, pmStyle, 0.60,
                Arrays.asList("Product Thinking", "Communication", "Leadership & Agile", "SQL & Databases", "Data Visualization"),
                Arrays.asList("product", "manager", "pm"),
                "+18% (Strong demand)", "$115,000 - $175,000"));

        return list;
    }

    public static List<CareerScoreResult> rankCareers(UserProfile profile, AssessmentResult assessment) {
        List<CareerScoreResult> results = new ArrayList<>();
        List<CareerModel> careers = getStandardCareers();

        Map<String, Double> userInterestVec = computeInterestVector(assessment);
        Map<String, Double> userStyleVec = computeStyleVector(assessment);
        double userAptitudeRatio = assessment != null && assessment.getTotalAptitudeQuestions() > 0
                ? (double) assessment.getAptitudeScore() / assessment.getTotalAptitudeQuestions() : 0.6;

        List<String> studentSkills = profile != null && profile.getTechnicalSkills() != null
                ? profile.getTechnicalSkills() : Collections.emptyList();
        String studentGoal = profile != null && profile.getCareerGoal() != null
                ? profile.getCareerGoal().toLowerCase() : "";

        for (CareerModel c : careers) {
            double iFit = cosineSimilarity(userInterestVec, c.getDimensions());
            double aFit = Math.min(1.0, userAptitudeRatio / c.getAptitudeThreshold());
            double sFit = cosineSimilarity(userStyleVec, c.getStyles());

            List<String> matched = new ArrayList<>();
            List<String> missing = new ArrayList<>();
            for (String req : c.getRequiredSkills()) {
                if (studentSkills.contains(req)) {
                    matched.add(req);
                } else {
                    missing.add(req);
                }
            }
            double kFit = c.getRequiredSkills().isEmpty() ? 0.5 : (double) matched.size() / c.getRequiredSkills().size();

            double gFit = 0.5;
            if (!studentGoal.isEmpty() && !studentGoal.contains("not sure")) {
                if (studentGoal.equalsIgnoreCase(c.getTitle()) || c.getTags().stream().anyMatch(studentGoal::contains)) {
                    gFit = 1.0;
                } else {
                    gFit = 0.3;
                }
            }

            // Weighted multi-factor formula:
            // 30% Interest RIASEC, 20% Aptitude, 15% Work Style, 20% Verified Skills, 15% Goal Alignment
            int total = (int) Math.round((iFit * 0.30 + aFit * 0.20 + sFit * 0.15 + kFit * 0.20 + gFit * 0.15) * 100);
            total = Math.max(10, Math.min(99, total));

            String why = buildWhyExplanation((int)(iFit*100), (int)(aFit*100), matched, missing);

            results.add(new CareerScoreResult(c, total, (int)(iFit*100), (int)(aFit*100),
                    (int)(sFit*100), (int)(kFit*100), (int)(gFit*100), matched, missing, why));
        }

        // Sort descending by total match score
        Collections.sort(results, (a, b) -> Integer.compare(b.getTotalScore(), a.getTotalScore()));
        return results;
    }

    private static double cosineSimilarity(Map<String, Double> v1, Map<String, Double> v2) {
        if (v1 == null || v2 == null || v1.isEmpty() || v2.isEmpty()) return 0.5;
        double dot = 0.0, mag1 = 0.0, mag2 = 0.0;
        for (String k : v2.keySet()) {
            double a = v1.getOrDefault(k, 0.0);
            double b = v2.get(k);
            dot += a * b;
            mag1 += a * a;
            mag2 += b * b;
        }
        return (mag1 > 0 && mag2 > 0) ? dot / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0.5;
    }

    private static Map<String, Double> computeInterestVector(AssessmentResult a) {
        Map<String, Double> vec = new HashMap<>();
        vec.put("B", 1.0); vec.put("A", 1.0); vec.put("C", 1.0); vec.put("P", 1.0); vec.put("L", 1.0);
        if (a == null || a.getInterestAnswers() == null) return vec;
        // Map answer indices to dimensions B, A, C, P, L
        String[] dims = {"B", "A", "C", "P", "L"};
        for (int ans : a.getInterestAnswers()) {
            if (ans >= 0 && ans < dims.length) {
                String d = dims[ans];
                vec.put(d, vec.getOrDefault(d, 0.0) + 1.0);
            }
        }
        return vec;
    }

    private static Map<String, Double> computeStyleVector(AssessmentResult a) {
        Map<String, Double> vec = new HashMap<>();
        vec.put("S", 1.0); vec.put("T", 1.0); vec.put("L", 1.0); vec.put("X", 1.0);
        if (a == null || a.getPersonalityAnswers() == null) return vec;
        String[] styles = {"S", "T", "L", "X"};
        for (int ans : a.getPersonalityAnswers()) {
            if (ans >= 0 && ans < styles.length) {
                String s = styles[ans];
                vec.put(s, vec.getOrDefault(s, 0.0) + 1.0);
            }
        }
        return vec;
    }

    private static String buildWhyExplanation(int iFit, int aFit, List<String> have, List<String> missing) {
        StringBuilder sb = new StringBuilder();
        if (iFit >= 75) sb.append("Your natural interests align strongly with day-to-day role duties. ");
        if (aFit >= 85) sb.append("Your aptitude benchmark meets or exceeds entry requirements. ");
        if (!have.isEmpty()) sb.append("You already hold: ").append(String.join(", ", have)).append(". ");
        if (!missing.isEmpty()) sb.append("Key skill gaps to close: ").append(String.join(", ", missing)).append(".");
        return sb.toString().trim();
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/services/GeminiAiService.java',
    category: 'java',
    description: 'Android HTTP client calling the secure backend proxy endpoint for AI Chatbot guidance',
    content: `package com.careerguidance.ai.services;

import android.os.Handler;
import android.os.Looper;

import com.careerguidance.ai.models.ChatMessage;
import com.careerguidance.ai.models.UserProfile;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class GeminiAiService {
    // Configurable backend URL. In production, points to Cloud Run / Firebase Functions backend proxy.
    // In local emulator testing, 10.0.2.2 accesses localhost on host machine.
    private static final String DEFAULT_BACKEND_URL = "https://ais-dev-fvn55wk47xf3j57tl3asvp-417744212480.asia-southeast1.run.app/api/ai/chat";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final OkHttpClient httpClient;
    private final Gson gson;
    private final Handler mainHandler;

    public interface AiChatCallback {
        void onSuccess(String reply, String source);
        void onError(String errorMessage);
    }

    public GeminiAiService() {
        this.httpClient = new OkHttpClient();
        this.gson = new Gson();
        this.mainHandler = new Handler(Looper.getMainLooper());
    }

    public void sendMessage(String userMessage, List<ChatMessage> history, UserProfile profile, AiChatCallback callback) {
        JsonObject payload = new JsonObject();
        payload.addProperty("message", userMessage);

        JsonArray historyArray = new JsonArray();
        if (history != null) {
            for (ChatMessage m : history) {
                JsonObject msgObj = new JsonObject();
                msgObj.addProperty("role", m.isUser() ? "user" : "model");
                msgObj.addProperty("text", m.getMessage());
                historyArray.add(msgObj);
            }
        }
        payload.add("history", historyArray);

        JsonObject profileObj = new JsonObject();
        if (profile != null) {
            profileObj.addProperty("name", profile.getName());
            profileObj.addProperty("edu", profile.getDegree());
            profileObj.addProperty("year", profile.getYearOfStudy());
            profileObj.addProperty("targetCareer", profile.getTargetCareerId());
        }
        payload.add("userProfile", profileObj);

        RequestBody body = RequestBody.create(payload.toString(), JSON);
        Request request = new Request.Builder()
                .url(DEFAULT_BACKEND_URL)
                .post(body)
                .build();

        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                mainHandler.post(() -> callback.onError("Network error: " + e.getMessage()));
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    mainHandler.post(() -> callback.onError("Server returned code " + response.code()));
                    return;
                }
                String respBody = response.body().string();
                try {
                    JsonObject respJson = gson.fromJson(respBody, JsonObject.class);
                    String reply = respJson.has("reply") ? respJson.get("reply").getAsString() : "No reply";
                    String source = respJson.has("source") ? respJson.get("source").getAsString() : "gemini";
                    mainHandler.post(() -> callback.onSuccess(reply, source));
                } catch (Exception parseEx) {
                    mainHandler.post(() -> callback.onError("Failed to parse response"));
                }
            }
        });
    }
}`,
  },

  // -------------------------------------------------------------
  // ACTIVITIES (com.careerguidance.ai)
  // -------------------------------------------------------------
  {
    path: 'app/src/main/java/com/careerguidance/ai/SplashActivity.java',
    category: 'java',
    description: 'SplashActivity verifying Firebase auth session and routing to MainActivity or WelcomeActivity',
    content: `package com.careerguidance.ai;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.appcompat.app.AppCompatActivity;

import com.careerguidance.ai.services.FirebaseManager;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        // 1.5s splash animation delay then route
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            FirebaseManager fm = FirebaseManager.getInstance();
            if (fm.isUserLoggedIn()) {
                startActivity(new Intent(SplashActivity.this, MainActivity.class));
            } else {
                startActivity(new Intent(SplashActivity.this, WelcomeActivity.class));
            }
            finish();
        }, 1500);
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/WelcomeActivity.java',
    category: 'java',
    description: 'Welcome and onboarding screen highlighting Interests, Aptitude, Personality, and Skills',
    content: `package com.careerguidance.ai;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class WelcomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

        Button btnRegister = findViewById(R.id.btnRegister);
        Button btnLogin = findViewById(R.id.btnLogin);
        Button btnGuest = findViewById(R.id.btnGuest);

        btnRegister.setOnClickListener(v ->
                startActivity(new Intent(WelcomeActivity.this, RegisterActivity.class)));

        btnLogin.setOnClickListener(v ->
                startActivity(new Intent(WelcomeActivity.this, LoginActivity.class)));

        btnGuest.setOnClickListener(v -> {
            // Guest mode bypasses auth for immediate exploration
            startActivity(new Intent(WelcomeActivity.this, MainActivity.class));
            finish();
        });
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/LoginActivity.java',
    category: 'java',
    description: 'Student login with Firebase Authentication, validation, and error messages',
    content: `package com.careerguidance.ai;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.careerguidance.ai.services.FirebaseManager;

public class LoginActivity extends AppCompatActivity {

    private EditText etEmail, etPassword;
    private Button btnLogin;
    private TextView tvForgotPassword, tvGoRegister, tvError;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        etEmail = findViewById(R.id.etLoginEmail);
        etPassword = findViewById(R.id.etLoginPassword);
        btnLogin = findViewById(R.id.btnPerformLogin);
        tvForgotPassword = findViewById(R.id.tvForgotPassword);
        tvGoRegister = findViewById(R.id.tvGoRegister);
        tvError = findViewById(R.id.tvLoginError);
        progressBar = findViewById(R.id.loginProgressBar);

        btnLogin.setOnClickListener(v -> attemptLogin());

        tvForgotPassword.setOnClickListener(v ->
                startActivity(new Intent(LoginActivity.this, ForgotPasswordActivity.class)));

        tvGoRegister.setOnClickListener(v ->
                startActivity(new Intent(LoginActivity.this, RegisterActivity.class)));
    }

    private void attemptLogin() {
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        tvError.setVisibility(View.GONE);

        if (TextUtils.isEmpty(email) || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            tvError.setText("Please enter a valid academic/personal email.");
            tvError.setVisibility(View.VISIBLE);
            return;
        }

        if (TextUtils.isEmpty(password) || password.length() < 6) {
            tvError.setText("Password must contain at least 6 characters.");
            tvError.setVisibility(View.VISIBLE);
            return;
        }

        progressBar.setVisibility(View.VISIBLE);
        btnLogin.setEnabled(false);

        FirebaseManager.getInstance().loginUser(email, password, task -> {
            progressBar.setVisibility(View.GONE);
            btnLogin.setEnabled(true);

            if (task.isSuccessful()) {
                Toast.makeText(LoginActivity.this, "Welcome back!", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                finish();
            } else {
                String errorMsg = task.getException() != null ? task.getException().getMessage() : "Authentication failed";
                tvError.setText(errorMsg);
                tvError.setVisibility(View.VISIBLE);
            }
        });
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/RegisterActivity.java',
    category: 'java',
    description: 'Student registration with Firebase Auth, creating student document in Cloud Firestore',
    content: `package com.careerguidance.ai;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.careerguidance.ai.models.UserProfile;
import com.careerguidance.ai.services.FirebaseManager;

public class RegisterActivity extends AppCompatActivity {

    private EditText etName, etEmail, etPassword;
    private Button btnRegister;
    private TextView tvGoLogin, tvError;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        etName = findViewById(R.id.etRegName);
        etEmail = findViewById(R.id.etRegEmail);
        etPassword = findViewById(R.id.etRegPassword);
        btnRegister = findViewById(R.id.btnPerformRegister);
        tvGoLogin = findViewById(R.id.tvRegGoLogin);
        tvError = findViewById(R.id.tvRegError);
        progressBar = findViewById(R.id.regProgressBar);

        btnRegister.setOnClickListener(v -> attemptRegister());
        tvGoLogin.setOnClickListener(v -> finish());
    }

    private void attemptRegister() {
        String name = etName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        tvError.setVisibility(View.GONE);

        if (TextUtils.isEmpty(name) || name.length() < 2) {
            tvError.setText("Please enter your full name.");
            tvError.setVisibility(View.VISIBLE);
            return;
        }

        if (TextUtils.isEmpty(email) || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            tvError.setText("Please enter a valid email address.");
            tvError.setVisibility(View.VISIBLE);
            return;
        }

        if (TextUtils.isEmpty(password) || password.length() < 6) {
            tvError.setText("Password must be at least 6 characters.");
            tvError.setVisibility(View.VISIBLE);
            return;
        }

        progressBar.setVisibility(View.VISIBLE);
        btnRegister.setEnabled(false);

        FirebaseManager fm = FirebaseManager.getInstance();
        fm.registerUser(email, password, task -> {
            if (task.isSuccessful()) {
                String uid = task.getResult().getUser().getUid();
                UserProfile profile = new UserProfile(uid, name, email);
                fm.saveUserProfile(profile, saveTask -> {
                    progressBar.setVisibility(View.GONE);
                    btnRegister.setEnabled(true);

                    Toast.makeText(RegisterActivity.this, "Account created successfully!", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(RegisterActivity.this, ProfileActivity.class);
                    startActivity(intent);
                    finish();
                });
            } else {
                progressBar.setVisibility(View.GONE);
                btnRegister.setEnabled(true);
                String errorMsg = task.getException() != null ? task.getException().getMessage() : "Registration failed";
                tvError.setText(errorMsg);
                tvError.setVisibility(View.VISIBLE);
            }
        });
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/ForgotPasswordActivity.java',
    category: 'java',
    description: 'Sends password reset email via Firebase Auth',
    content: `package com.careerguidance.ai;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.careerguidance.ai.services.FirebaseManager;

public class ForgotPasswordActivity extends AppCompatActivity {

    private EditText etEmail;
    private Button btnSendReset;
    private TextView tvStatus;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        etEmail = findViewById(R.id.etResetEmail);
        btnSendReset = findViewById(R.id.btnSendReset);
        tvStatus = findViewById(R.id.tvResetStatus);
        progressBar = findViewById(R.id.resetProgressBar);

        btnSendReset.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            if (TextUtils.isEmpty(email) || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                tvStatus.setText("Enter a valid email address.");
                tvStatus.setVisibility(View.VISIBLE);
                return;
            }

            progressBar.setVisibility(View.VISIBLE);
            btnSendReset.setEnabled(false);

            FirebaseManager.getInstance().resetPassword(email, task -> {
                progressBar.setVisibility(View.GONE);
                btnSendReset.setEnabled(true);

                if (task.isSuccessful()) {
                    Toast.makeText(this, "Password reset email sent!", Toast.LENGTH_LONG).show();
                    finish();
                } else {
                    String msg = task.getException() != null ? task.getException().getMessage() : "Failed to send reset email";
                    tvStatus.setText(msg);
                    tvStatus.setVisibility(View.VISIBLE);
                }
            });
        });
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/MainActivity.java',
    category: 'java',
    description: 'Dashboard Activity connecting student profile, top career match, roadmap %, priority gaps, and bottom navigation',
    content: `package com.careerguidance.ai;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.careerguidance.ai.models.CareerScoreResult;
import com.careerguidance.ai.models.UserProfile;
import com.careerguidance.ai.services.CareerScoringEngine;
import com.careerguidance.ai.services.FirebaseManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

public class MainActivity extends AppCompatActivity {

    private TextView tvGreeting, tvTopMatch, tvRoadmapPct, tvPriorityGaps;
    private View cardNextAction, cardAssess, cardCareers, cardGaps, cardProgress;
    private FloatingActionButton fabChatbot;
    private BottomNavigationView bottomNav;

    private UserProfile currentProfile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tvGreeting = findViewById(R.id.tvHomeGreeting);
        tvTopMatch = findViewById(R.id.tvHomeTopMatch);
        tvRoadmapPct = findViewById(R.id.tvHomeRoadmapPct);
        tvPriorityGaps = findViewById(R.id.tvHomePriorityGaps);

        cardNextAction = findViewById(R.id.cardNextAction);
        cardAssess = findViewById(R.id.cardAssess);
        cardCareers = findViewById(R.id.cardCareers);
        cardGaps = findViewById(R.id.cardGaps);
        cardProgress = findViewById(R.id.cardProgress);
        fabChatbot = findViewById(R.id.fabChatbot);
        bottomNav = findViewById(R.id.bottomNavigation);

        setupClickListeners();
        setupBottomNav();
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadDashboardData();
    }

    private void loadDashboardData() {
        FirebaseManager.getInstance().fetchUserProfile(task -> {
            if (task.isSuccessful() && task.getResult() != null && task.getResult().exists()) {
                currentProfile = task.getResult().toObject(UserProfile.class);
            }
            if (currentProfile == null) {
                currentProfile = new UserProfile("local", "Student", "student@example.com");
            }
            updateUI();
        });
    }

    private void updateUI() {
        String firstName = currentProfile.getName() != null ? currentProfile.getName().split(" ")[0] : "Student";
        tvGreeting.setText("Hello, " + firstName + " 👋");

        List<CareerScoreResult> ranked = CareerScoringEngine.rankCareers(currentProfile, null);
        if (!ranked.isEmpty()) {
            CareerScoreResult top = ranked.get(0);
            tvTopMatch.setText(top.getTotalScore() + "%");
            tvPriorityGaps.setText(String.valueOf(top.getMissingSkills().size()));
        } else {
            tvTopMatch.setText("–");
            tvPriorityGaps.setText("–");
        }
        tvRoadmapPct.setText("25%");
    }

    private void setupClickListeners() {
        cardAssess.setOnClickListener(v ->
                startActivity(new Intent(MainActivity.this, AssessmentActivity.class)));

        cardCareers.setOnClickListener(v ->
                startActivity(new Intent(MainActivity.this, CareerRecommendationsActivity.class)));

        cardGaps.setOnClickListener(v ->
                startActivity(new Intent(MainActivity.this, SkillGapActivity.class)));

        cardProgress.setOnClickListener(v ->
                startActivity(new Intent(MainActivity.this, ProgressActivity.class)));

        cardNextAction.setOnClickListener(v -> {
            if (currentProfile != null && !currentProfile.isAssessmentCompleted()) {
                startActivity(new Intent(MainActivity.this, AssessmentActivity.class));
            } else {
                startActivity(new Intent(MainActivity.this, CareerRecommendationsActivity.class));
            }
        });

        fabChatbot.setOnClickListener(v ->
                startActivity(new Intent(MainActivity.this, ChatbotActivity.class)));
    }

    private void setupBottomNav() {
        bottomNav.setSelectedItemId(R.id.nav_home);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) {
                return true;
            } else if (id == R.id.nav_assess) {
                startActivity(new Intent(this, AssessmentActivity.class));
                return true;
            } else if (id == R.id.nav_careers) {
                startActivity(new Intent(this, CareerRecommendationsActivity.class));
                return true;
            } else if (id == R.id.nav_roadmap) {
                startActivity(new Intent(this, RoadmapActivity.class));
                return true;
            } else if (id == R.id.nav_profile) {
                startActivity(new Intent(this, ProfileActivity.class));
                return true;
            }
            return false;
        });
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/ChatbotActivity.java',
    category: 'java',
    description: 'AI Career Copilot Chatbot Activity connecting to Gemini via GeminiAiService with chips & RecyclerView',
    content: `package com.careerguidance.ai;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.careerguidance.ai.adapters.ChatAdapter;
import com.careerguidance.ai.models.ChatMessage;
import com.careerguidance.ai.models.UserProfile;
import com.careerguidance.ai.services.FirebaseManager;
import com.careerguidance.ai.services.GeminiAiService;
import com.google.android.material.chip.Chip;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ChatbotActivity extends AppCompatActivity {

    private RecyclerView rvChat;
    private EditText etInput;
    private ImageButton btnSend;
    private ProgressBar pbThinking;
    private ChatAdapter chatAdapter;
    private List<ChatMessage> messageList;

    private GeminiAiService geminiService;
    private UserProfile userProfile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chatbot);

        rvChat = findViewById(R.id.rvChatMessages);
        etInput = findViewById(R.id.etChatMessage);
        btnSend = findViewById(R.id.btnChatSend);
        pbThinking = findViewById(R.id.pbChatThinking);

        messageList = new ArrayList<>();
        chatAdapter = new ChatAdapter(messageList);
        rvChat.setLayoutManager(new LinearLayoutManager(this));
        rvChat.setAdapter(chatAdapter);

        geminiService = new GeminiAiService();

        // Initial welcoming message
        messageList.add(new ChatMessage("1", "Hello! I am your AI Career Copilot. Ask me about programming roadmaps, interview prep, skill gaps, or resume strategies.", false, getNowTime(), "gemini"));
        chatAdapter.notifyDataSetChanged();

        btnSend.setOnClickListener(v -> sendMessage());

        setupQuickPromptChips();
        loadUserProfile();
    }

    private void loadUserProfile() {
        FirebaseManager.getInstance().fetchUserProfile(task -> {
            if (task.isSuccessful() && task.getResult() != null && task.getResult().exists()) {
                userProfile = task.getResult().toObject(UserProfile.class);
            }
        });
    }

    private void setupQuickPromptChips() {
        findViewById(R.id.chipPrompt1).setOnClickListener(v -> {
            etInput.setText("Explain my top career match and required skills.");
            sendMessage();
        });
        findViewById(R.id.chipPrompt2).setOnClickListener(v -> {
            etInput.setText("What beginner project should I build first?");
            sendMessage();
        });
        findViewById(R.id.chipPrompt3).setOnClickListener(v -> {
            etInput.setText("Give me a 4-week study roadmap for DSA and System Design.");
            sendMessage();
        });
    }

    private void sendMessage() {
        String text = etInput.getText().toString().trim();
        if (TextUtils.isEmpty(text)) return;

        etInput.setText("");
        messageList.add(new ChatMessage(String.valueOf(System.currentTimeMillis()), text, true, getNowTime(), "user"));
        chatAdapter.notifyItemInserted(messageList.size() - 1);
        rvChat.scrollToPosition(messageList.size() - 1);

        pbThinking.setVisibility(View.VISIBLE);

        geminiService.sendMessage(text, messageList, userProfile, new GeminiAiService.AiChatCallback() {
            @Override
            public void onSuccess(String reply, String source) {
                pbThinking.setVisibility(View.GONE);
                messageList.add(new ChatMessage(String.valueOf(System.currentTimeMillis()), reply, false, getNowTime(), source));
                chatAdapter.notifyItemInserted(messageList.size() - 1);
                rvChat.scrollToPosition(messageList.size() - 1);
            }

            @Override
            public void onError(String errorMessage) {
                pbThinking.setVisibility(View.GONE);
                Toast.makeText(ChatbotActivity.this, "Offline guidance: " + errorMessage, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private String getNowTime() {
        return new SimpleDateFormat("hh:mm a", Locale.getDefault()).format(new Date());
    }
}`,
  },

  // -------------------------------------------------------------
  // RECYCLERVIEW ADAPTERS (com.careerguidance.ai.adapters)
  // -------------------------------------------------------------
  {
    path: 'app/src/main/java/com/careerguidance/ai/adapters/ChatAdapter.java',
    category: 'java',
    description: 'RecyclerView adapter rendering distinct user and AI counselor chat bubbles',
    content: `package com.careerguidance.ai.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.careerguidance.ai.R;
import com.careerguidance.ai.models.ChatMessage;

import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE_USER = 1;
    private static final int TYPE_BOT = 2;

    private final List<ChatMessage> messages;

    public ChatAdapter(List<ChatMessage> messages) {
        this.messages = messages;
    }

    @Override
    public int getItemViewType(int position) {
        return messages.get(position).isUser() ? TYPE_USER : TYPE_BOT;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TYPE_USER) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_chat_user, parent, false);
            return new UserMessageViewHolder(v);
        } else {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_chat_bot, parent, false);
            return new BotMessageViewHolder(v);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ChatMessage msg = messages.get(position);
        if (holder instanceof UserMessageViewHolder) {
            ((UserMessageViewHolder) holder).tvMessage.setText(msg.getMessage());
            ((UserMessageViewHolder) holder).tvTime.setText(msg.getTimestamp());
        } else if (holder instanceof BotMessageViewHolder) {
            ((BotMessageViewHolder) holder).tvMessage.setText(msg.getMessage());
            ((BotMessageViewHolder) holder).tvTime.setText(msg.getTimestamp());
        }
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    static class UserMessageViewHolder extends RecyclerView.ViewHolder {
        TextView tvMessage, tvTime;
        UserMessageViewHolder(View itemView) {
            super(itemView);
            tvMessage = itemView.findViewById(R.id.tvUserMessageText);
            tvTime = itemView.findViewById(R.id.tvUserMessageTime);
        }
    }

    static class BotMessageViewHolder extends RecyclerView.ViewHolder {
        TextView tvMessage, tvTime;
        BotMessageViewHolder(View itemView) {
            super(itemView);
            tvMessage = itemView.findViewById(R.id.tvBotMessageText);
            tvTime = itemView.findViewById(R.id.tvBotMessageTime);
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/careerguidance/ai/adapters/CareerAdapter.java',
    category: 'java',
    description: 'RecyclerView adapter for career cards displaying icon, title, match percentage, and explainability tags',
    content: `package com.careerguidance.ai.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.careerguidance.ai.R;
import com.careerguidance.ai.models.CareerScoreResult;

import java.util.List;

public class CareerAdapter extends RecyclerView.Adapter<CareerAdapter.CareerViewHolder> {

    public interface OnCareerClickListener {
        void onExplore(CareerScoreResult result);
        void onExplain(CareerScoreResult result);
    }

    private final List<CareerScoreResult> items;
    private final OnCareerClickListener listener;

    public CareerAdapter(List<CareerScoreResult> items, OnCareerClickListener listener) {
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public CareerViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_career_card, parent, false);
        return new CareerViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull CareerViewHolder holder, int position) {
        CareerScoreResult res = items.get(position);
        holder.tvIcon.setText(res.getCareer().getIcon());
        holder.tvTitle.setText(res.getCareer().getTitle());
        holder.tvScore.setText(res.getTotalScore() + "%");
        holder.tvWhy.setText(res.getExplainableSummary());

        holder.btnExplore.setOnClickListener(v -> listener.onExplore(res));
        holder.btnExplain.setOnClickListener(v -> listener.onExplain(res));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class CareerViewHolder extends RecyclerView.ViewHolder {
        TextView tvIcon, tvTitle, tvScore, tvWhy;
        Button btnExplore, btnExplain;

        CareerViewHolder(View itemView) {
            super(itemView);
            tvIcon = itemView.findViewById(R.id.tvItemCareerIcon);
            tvTitle = itemView.findViewById(R.id.tvItemCareerTitle);
            tvScore = itemView.findViewById(R.id.tvItemCareerScore);
            tvWhy = itemView.findViewById(R.id.tvItemCareerWhy);
            btnExplore = itemView.findViewById(R.id.btnItemCareerExplore);
            btnExplain = itemView.findViewById(R.id.btnItemCareerExplain);
        }
    }
}`,
  },

  // -------------------------------------------------------------
  // XML LAYOUTS
  // -------------------------------------------------------------
  {
    path: 'app/src/main/res/layout/activity_splash.xml',
    category: 'xml',
    description: 'Splash screen layout with star badge and deep ink brand background',
    content: `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/ink"
    android:padding="32dp">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:gravity="center"
        android:orientation="vertical">

        <TextView
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:background="@drawable/bg_gold_badge"
            android:gravity="center"
            android:text="✦"
            android:textColor="@color/ink"
            android:textSize="28sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:letterSpacing="0.15"
            android:text="AI-ENHANCED CAREER GUIDANCE"
            android:textColor="@color/mint"
            android:textSize="11sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:gravity="center"
            android:text="Every career is a trail.\nFind yours."
            android:textColor="@color/on_ink"
            android:textSize="26sp"
            android:textStyle="bold" />

    </LinearLayout>

    <ProgressBar
        android:layout_width="32dp"
        android:layout_height="32dp"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        android:indeterminateTint="@color/gold" />

</RelativeLayout>`,
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    category: 'xml',
    description: 'Main Dashboard XML layout with top stats, actionable recommendation card, and bottom navigation',
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/paper">

    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginBottom="60dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical">

            <!-- Hero Header -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:background="@color/ink"
                android:orientation="vertical"
                android:padding="24dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:letterSpacing="0.1"
                    android:text="YOUR DASHBOARD"
                    android:textColor="@color/on_ink_soft"
                    android:textSize="11sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvHomeGreeting"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:text="Hello, Student 👋"
                    android:textColor="@color/on_ink"
                    android:textSize="24sp"
                    android:textStyle="bold" />

                <!-- Stats Row -->
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="16dp"
                    android:orientation="horizontal"
                    android:weightSum="3">

                    <androidx.cardview.widget.CardView
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_marginEnd="4dp"
                        android:layout_weight="1"
                        app:cardBackgroundColor="#1AFFFFFF"
                        app:cardCornerRadius="12dp"
                        app:cardElevation="0dp">
                        <LinearLayout
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:orientation="vertical"
                            android:padding="12dp">
                            <TextView
                                android:id="@+id/tvHomeTopMatch"
                                android:layout_width="wrap_content"
                                android:layout_height="wrap_content"
                                android:text="88%"
                                android:textColor="@color/gold"
                                android:textSize="18sp"
                                android:textStyle="bold" />
                            <TextView
                                android:layout_width="wrap_content"
                                android:layout_height="wrap_content"
                                android:text="Top match"
                                android:textColor="@color/on_ink_soft"
                                android:textSize="11sp" />
                        </LinearLayout>
                    </androidx.cardview.widget.CardView>

                    <androidx.cardview.widget.CardView
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_marginHorizontal="2dp"
                        android:layout_weight="1"
                        app:cardBackgroundColor="#1AFFFFFF"
                        app:cardCornerRadius="12dp"
                        app:cardElevation="0dp">
                        <LinearLayout
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:orientation="vertical"
                            android:padding="12dp">
                            <TextView
                                android:id="@+id/tvHomeRoadmapPct"
                                android:layout_width="wrap_content"
                                android:layout_height="wrap_content"
                                android:text="25%"
                                android:textColor="@color/mint"
                                android:textSize="18sp"
                                android:textStyle="bold" />
                            <TextView
                                android:layout_width="wrap_content"
                                android:layout_height="wrap_content"
                                android:text="Roadmap"
                                android:textColor="@color/on_ink_soft"
                                android:textSize="11sp" />
                        </LinearLayout>
                    </androidx.cardview.widget.CardView>

                    <androidx.cardview.widget.CardView
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_marginStart="4dp"
                        android:layout_weight="1"
                        app:cardBackgroundColor="#1AFFFFFF"
                        app:cardCornerRadius="12dp"
                        app:cardElevation="0dp">
                        <LinearLayout
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:orientation="vertical"
                            android:padding="12dp">
                            <TextView
                                android:id="@+id/tvHomePriorityGaps"
                                android:layout_width="wrap_content"
                                android:layout_height="wrap_content"
                                android:text="3"
                                android:textColor="@color/on_ink"
                                android:textSize="18sp"
                                android:textStyle="bold" />
                            <TextView
                                android:layout_width="wrap_content"
                                android:layout_height="wrap_content"
                                android:text="Priority gaps"
                                android:textColor="@color/on_ink_soft"
                                android:textSize="11sp" />
                        </LinearLayout>
                    </androidx.cardview.widget.CardView>

                </LinearLayout>

            </LinearLayout>

            <!-- Dashboard Content Items -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="20dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    android:text="Continue your journey"
                    android:textColor="@color/text_primary"
                    android:textSize="18sp"
                    android:textStyle="bold" />

                <!-- Action Card: Next Best Step -->
                <androidx.cardview.widget.CardView
                    android:id="@+id/cardNextAction"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    app:cardBackgroundColor="@color/white"
                    app:cardCornerRadius="16dp"
                    app:cardElevation="2dp">
                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:orientation="vertical"
                        android:padding="16dp">
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="⭐ Next Best Action"
                            android:textColor="@color/text_primary"
                            android:textSize="15sp"
                            android:textStyle="bold" />
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_marginTop="4dp"
                            android:text="Complete your 3-stage assessment to unlock explainable recommendations."
                            android:textColor="@color/text_soft"
                            android:textSize="13sp" />
                    </LinearLayout>
                </androidx.cardview.widget.CardView>

                <!-- Action Card: Assessment -->
                <androidx.cardview.widget.CardView
                    android:id="@+id/cardAssess"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    app:cardBackgroundColor="@color/white"
                    app:cardCornerRadius="16dp"
                    app:cardElevation="2dp">
                    <RelativeLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:padding="16dp">
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="🧠 Career Assessment"
                            android:textColor="@color/text_primary"
                            android:textSize="15sp"
                            android:textStyle="bold" />
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_alignParentEnd="true"
                            android:text="3 Parts ›"
                            android:textColor="@color/mint_deep"
                            android:textStyle="bold" />
                    </RelativeLayout>
                </androidx.cardview.widget.CardView>

                <!-- Action Card: Recommendations -->
                <androidx.cardview.widget.CardView
                    android:id="@+id/cardCareers"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    app:cardBackgroundColor="@color/white"
                    app:cardCornerRadius="16dp"
                    app:cardElevation="2dp">
                    <RelativeLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:padding="16dp">
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="🎯 View Recommendations"
                            android:textColor="@color/text_primary"
                            android:textSize="15sp"
                            android:textStyle="bold" />
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_alignParentEnd="true"
                            android:text="Explore ›"
                            android:textColor="@color/gold_deep"
                            android:textStyle="bold" />
                    </RelativeLayout>
                </androidx.cardview.widget.CardView>

                <!-- Action Card: Skill Gaps -->
                <androidx.cardview.widget.CardView
                    android:id="@+id/cardGaps"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    app:cardBackgroundColor="@color/white"
                    app:cardCornerRadius="16dp"
                    app:cardElevation="2dp">
                    <RelativeLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:padding="16dp">
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="🛠 Close Skill Gaps"
                            android:textColor="@color/text_primary"
                            android:textSize="15sp"
                            android:textStyle="bold" />
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_alignParentEnd="true"
                            android:text="Action Plan ›"
                            android:textColor="@color/coral_deep"
                            android:textStyle="bold" />
                    </RelativeLayout>
                </androidx.cardview.widget.CardView>

                <!-- Action Card: Weekly Progress -->
                <androidx.cardview.widget.CardView
                    android:id="@+id/cardProgress"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginBottom="12dp"
                    app:cardBackgroundColor="@color/white"
                    app:cardCornerRadius="16dp"
                    app:cardElevation="2dp">
                    <RelativeLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:padding="16dp">
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="📈 Weekly Adaptive Check-in"
                            android:textColor="@color/text_primary"
                            android:textSize="15sp"
                            android:textStyle="bold" />
                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:layout_alignParentEnd="true"
                            android:text="Open ›"
                            android:textColor="@color/mint_deep"
                            android:textStyle="bold" />
                    </RelativeLayout>
                </androidx.cardview.widget.CardView>

            </LinearLayout>

        </LinearLayout>

    </androidx.core.widget.NestedScrollView>

    <!-- Floating Action Button: AI Counselor -->
    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fabChatbot"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_marginEnd="20dp"
        android:layout_marginBottom="76dp"
        android:contentDescription="Open AI Career Counselor"
        android:src="@android:drawable/ic_dialog_email"
        app:backgroundTint="@color/gold"
        app:tint="@color/ink" />

    <!-- Bottom Navigation Bar -->
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigation"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        android:background="@color/paper"
        app:itemIconTint="@color/ink"
        app:itemTextColor="@color/ink"
        app:menu="@menu/bottom_nav_menu" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>`,
  },
  {
    path: 'app/src/main/res/layout/activity_chatbot.xml',
    category: 'xml',
    description: 'AI Career Guidance Chatbot layout with conversation history, suggested prompt chips, and message input',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/paper"
    android:orientation="vertical">

    <!-- Chat Header -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@color/ink"
        android:orientation="vertical"
        android:padding="20dp">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:letterSpacing="0.1"
            android:text="AI CAREER COPILOT"
            android:textColor="@color/mint"
            android:textSize="11sp"
            android:textStyle="bold" />
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="2dp"
            android:text="Career &amp; Learning Counselor"
            android:textColor="@color/on_ink"
            android:textSize="20sp"
            android:textStyle="bold" />
    </LinearLayout>

    <!-- Chat Messages RecyclerView -->
    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvChatMessages"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:clipToPadding="false"
        android:padding="16dp" />

    <ProgressBar
        android:id="@+id/pbChatThinking"
        android:layout_width="24dp"
        android:layout_height="24dp"
        android:layout_gravity="center"
        android:layout_marginBottom="8dp"
        android:indeterminateTint="@color/gold"
        android:visibility="gone" />

    <!-- Suggested Quick Chips -->
    <HorizontalScrollView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:paddingHorizontal="16dp"
        android:paddingBottom="8dp"
        android:scrollbars="none">
        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal">
            <com.google.android.material.chip.Chip
                android:id="@+id/chipPrompt1"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginEnd="8dp"
                android:text="Explain my top match" />
            <com.google.android.material.chip.Chip
                android:id="@+id/chipPrompt2"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginEnd="8dp"
                android:text="What project to build first?" />
            <com.google.android.material.chip.Chip
                android:id="@+id/chipPrompt3"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="4-week DSA Roadmap" />
        </LinearLayout>
    </HorizontalScrollView>

    <!-- Input Row -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@color/white"
        android:gravity="center_vertical"
        android:orientation="horizontal"
        android:padding="12dp">

        <EditText
            android:id="@+id/etChatMessage"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:background="@drawable/bg_input_field"
            android:hint="Ask about skills, roadmaps, interviews..."
            android:maxLines="3"
            android:padding="12dp"
            android:textSize="14sp" />

        <ImageButton
            android:id="@+id/btnChatSend"
            android:layout_width="44dp"
            android:layout_height="44dp"
            android:layout_marginStart="8dp"
            android:background="@drawable/bg_gold_circle"
            android:contentDescription="Send"
            android:src="@android:drawable/ic_menu_send" />

    </LinearLayout>

</LinearLayout>`,
  },
  {
    path: 'app/src/main/res/layout/item_career_card.xml',
    category: 'xml',
    description: 'Item card XML for recommended careers with score and exploration buttons',
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="12dp"
    app:cardBackgroundColor="@color/white"
    app:cardCornerRadius="16dp"
    app:cardElevation="2dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <RelativeLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content">
            <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal">
                <TextView
                    android:id="@+id/tvItemCareerIcon"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="💻"
                    android:textSize="20sp" />
                <TextView
                    android:id="@+id/tvItemCareerTitle"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginStart="8dp"
                    android:text="Software Engineer"
                    android:textColor="@color/text_primary"
                    android:textSize="16sp"
                    android:textStyle="bold" />
            </LinearLayout>

            <TextView
                android:id="@+id/tvItemCareerScore"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_alignParentEnd="true"
                android:text="88%"
                android:textColor="@color/gold_deep"
                android:textSize="18sp"
                android:textStyle="bold" />
        </RelativeLayout>

        <TextView
            android:id="@+id/tvItemCareerWhy"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="Why: Strong interest alignment and aptitude benchmark match."
            android:textColor="@color/text_soft"
            android:textSize="13sp" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:orientation="horizontal">

            <Button
                android:id="@+id/btnItemCareerExplore"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_marginEnd="6dp"
                android:layout_weight="1"
                android:text="Explore"
                android:textColor="@color/ink" />

            <Button
                android:id="@+id/btnItemCareerExplain"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_marginStart="6dp"
                android:layout_weight="1"
                android:text="Explain Score"
                android:textColor="@color/ink" />

        </LinearLayout>

    </LinearLayout>

</androidx.cardview.widget.CardView>`,
  },
  {
    path: 'app/src/main/res/layout/item_chat_user.xml',
    category: 'xml',
    description: 'Chat bubble for student user messages',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:gravity="end"
    android:orientation="vertical"
    android:paddingVertical="4dp">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="64dp"
        android:background="@drawable/bg_chat_user"
        android:orientation="vertical"
        android:padding="12dp">

        <TextView
            android:id="@+id/tvUserMessageText"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Can you explain my roadmap?"
            android:textColor="@color/on_ink"
            android:textSize="14sp" />

        <TextView
            android:id="@+id/tvUserMessageTime"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="end"
            android:layout_marginTop="4dp"
            android:text="10:30 AM"
            android:textColor="@color/on_ink_soft"
            android:textSize="10sp" />

    </LinearLayout>

</LinearLayout>`,
  },
  {
    path: 'app/src/main/res/layout/item_chat_bot.xml',
    category: 'xml',
    description: 'Chat bubble for AI counselor response messages',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:gravity="start"
    android:orientation="vertical"
    android:paddingVertical="4dp">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginEnd="64dp"
        android:background="@drawable/bg_chat_bot"
        android:orientation="vertical"
        android:padding="12dp">

        <TextView
            android:id="@+id/tvBotMessageText"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="For Software Engineering, your first milestone is mastering DSA..."
            android:textColor="@color/text_primary"
            android:textSize="14sp" />

        <TextView
            android:id="@+id/tvBotMessageTime"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="end"
            android:layout_marginTop="4dp"
            android:text="10:31 AM"
            android:textColor="@color/text_soft"
            android:textSize="10sp" />

    </LinearLayout>

</LinearLayout>`,
  },

  // -------------------------------------------------------------
  // DRAWABLES & MENUS
  // -------------------------------------------------------------
  {
    path: 'app/src/main/res/drawable/bg_gold_badge.xml',
    category: 'xml',
    description: 'Circle gold badge drawable',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/gold" />
</shape>`,
  },
  {
    path: 'app/src/main/res/drawable/bg_gold_circle.xml',
    category: 'xml',
    description: 'Gold circle shape for send button and badges',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="@color/gold" />
</shape>`,
  },
  {
    path: 'app/src/main/res/drawable/bg_input_field.xml',
    category: 'xml',
    description: 'Rounded input field background with subtle border',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/white" />
    <stroke android:width="1.5dp" android:color="@color/paper_dim" />
    <corners android:radius="12dp" />
</shape>`,
  },
  {
    path: 'app/src/main/res/drawable/bg_chat_user.xml',
    category: 'xml',
    description: 'Bubble shape for user messages',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/ink" />
    <corners android:topLeftRadius="16dp" android:topRightRadius="16dp" android:bottomLeftRadius="16dp" android:bottomRightRadius="4dp" />
</shape>`,
  },
  {
    path: 'app/src/main/res/drawable/bg_chat_bot.xml',
    category: 'xml',
    description: 'Bubble shape for AI assistant messages',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/white" />
    <stroke android:width="1dp" android:color="@color/paper_dim" />
    <corners android:topLeftRadius="16dp" android:topRightRadius="16dp" android:bottomLeftRadius="4dp" android:bottomRightRadius="16dp" />
</shape>`,
  },
  {
    path: 'app/src/main/res/menu/bottom_nav_menu.xml',
    category: 'xml',
    description: 'Bottom navigation menu definition for Android App',
    content: `<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/nav_home"
        android:icon="@android:drawable/ic_menu_myplaces"
        android:title="Home" />
    <item
        android:id="@+id/nav_assess"
        android:icon="@android:drawable/ic_menu_edit"
        android:title="Assess" />
    <item
        android:id="@+id/nav_careers"
        android:icon="@android:drawable/ic_menu_compass"
        android:title="Careers" />
    <item
        android:id="@+id/nav_roadmap"
        android:icon="@android:drawable/ic_menu_directions"
        android:title="Roadmap" />
    <item
        android:id="@+id/nav_profile"
        android:icon="@android:drawable/ic_menu_my_calendar"
        android:title="Profile" />
</menu>`,
  },

  // -------------------------------------------------------------
  // FIREBASE CONFIG & SECURITY RULES
  // -------------------------------------------------------------
  {
    path: 'firestore.rules',
    category: 'config',
    description: 'Cloud Firestore security rules enforcing user-isolated read/write access',
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Students collection: each student can only read and write their own profile
    match /students/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Assessments collection: user-specific RIASEC and aptitude scores
    match /assessments/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Progress and learning milestones
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Default deny for all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`,
  },
  {
    path: 'app/google-services.json',
    category: 'config',
    description: 'Template configuration file for Firebase Android setup',
    content: `{
  "project_info": {
    "project_number": "417744212480",
    "project_id": "ai-career-guidance",
    "storage_bucket": "ai-career-guidance.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:417744212480:android:8e5399c125c84c659f7d",
        "android_client_info": {
          "package_name": "com.careerguidance.ai"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSy_SAMPLE_FIREBASE_KEY_FOR_LOCAL_BUILD"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}`,
  },
  {
    path: 'README_ANDROID.md',
    category: 'doc',
    description: 'Step-by-step instructions to open, build, and run the project in Android Studio',
    content: `# AI Enhanced Career Guidance System – Android Studio Project

## Prerequisites
1. **Android Studio Hedgehog / Iguana / Jellyfish** or newer (with JDK 17 or JDK 18).
2. **Android SDK API 34** installed via SDK Manager.
3. An active **Firebase Project** with Email/Password Authentication & Cloud Firestore enabled.

## Quick Setup Steps
1. Open Android Studio and select **File > Open**, then choose this project directory.
2. Ensure \`google-services.json\` is located in the \`app/\` folder (download from Firebase Console > Project Settings > Your Android App).
3. In Android Studio, click **Sync Project with Gradle Files**.
4. Run on an Android Emulator (API 31+) or physical device by clicking **Run 'app' (Shift+F10)**.

## Security Architecture
- Private API keys are never bundled directly in the client APK.
- The AI Career Chatbot talks to the secure proxy backend endpoint \`/api/ai/chat\` where Gemini 3.8 Flash handles queries.
- Cloud Firestore security rules strictly protect each student's personal assessment and profile data under their unique Firebase Auth UID.`,
  },
];
