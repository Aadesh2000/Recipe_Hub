package com.recipehub.service;

import com.recipehub.model.Timer;
import java.util.List;

public interface TimerService {
    Timer createTimer(String recipeId, String stepId, String userId, long durationMinutes);
    Timer startTimer(String timerId);
    Timer pauseTimer(String timerId);
    Timer resumeTimer(String timerId);
    Timer stopTimer(String timerId);
    Timer getTimer(String timerId);
    List<Timer> getActiveTimers(String userId);
    void deleteTimer(String timerId);
    void cleanupExpiredTimers();
} 