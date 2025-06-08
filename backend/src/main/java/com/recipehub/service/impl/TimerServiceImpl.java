package com.recipehub.service.impl;

import com.recipehub.model.Timer;
import com.recipehub.repository.TimerRepository;
import com.recipehub.service.TimerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class TimerServiceImpl implements TimerService {

    @Autowired
    private TimerRepository timerRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public Timer createTimer(String recipeId, String stepId, String userId, long durationMinutes) {
        Timer timer = new Timer();
        timer.setRecipeId(recipeId);
        timer.setUserId(userId);
        timer.setDurationInSeconds((int) (durationMinutes * 60));
        timer.setActive(false);
        timer.setStatus("CREATED");
        return timerRepository.save(timer);
    }

    @Override
    public Timer startTimer(String timerId) {
        Timer timer = getTimer(timerId);
        timer.setStartTime(Instant.now());
        timer.setEndTime(timer.getStartTime().plusSeconds(timer.getDurationInSeconds()));
        timer.setActive(true);
        timer.setStatus("RUNNING");
        timer.setRemainingTime(Duration.ofSeconds(timer.getDurationInSeconds()));
        return timerRepository.save(timer);
    }

    @Override
    public Timer pauseTimer(String timerId) {
        Timer timer = getTimer(timerId);
        if (timer.isActive() && !"PAUSED".equals(timer.getStatus())) {
            timer.setStatus("PAUSED");
            timer.setRemainingTime(Duration.between(Instant.now(), timer.getEndTime()));
        }
        return timerRepository.save(timer);
    }

    @Override
    public Timer resumeTimer(String timerId) {
        Timer timer = getTimer(timerId);
        if (timer.isActive() && "PAUSED".equals(timer.getStatus())) {
            timer.setStatus("RUNNING");
            timer.setEndTime(Instant.now().plus(timer.getRemainingTime()));
        }
        return timerRepository.save(timer);
    }

    @Override
    public Timer stopTimer(String timerId) {
        Timer timer = getTimer(timerId);
        timer.setActive(false);
        timer.setStatus("STOPPED");
        return timerRepository.save(timer);
    }

    @Override
    public Timer getTimer(String timerId) {
        return timerRepository.findById(timerId)
                .orElseThrow(() -> new NoSuchElementException("Timer not found"));
    }

    @Override
    public List<Timer> getActiveTimers(String userId) {
        return timerRepository.findByUserIdAndIsActiveTrue(userId);
    }

    @Override
    public void deleteTimer(String timerId) {
        timerRepository.deleteById(timerId);
    }

    @Override
    @Scheduled(fixedRate = 1000) // Update every second
    public void cleanupExpiredTimers() {
        List<Timer> activeTimers = timerRepository.findByIsActiveTrue();
        Instant now = Instant.now();

        for (Timer timer : activeTimers) {
            if (!"PAUSED".equals(timer.getStatus()) && now.isAfter(timer.getEndTime())) {
                timer.setActive(false);
                timer.setStatus("COMPLETED");
                timerRepository.save(timer);
                
                // Notify user via WebSocket
                messagingTemplate.convertAndSendToUser(
                    timer.getUserId(),
                    "/queue/timers",
                    Map.of(
                        "timerId", timer.getId(),
                        "status", "COMPLETED",
                        "message", "Timer completed!"
                    )
                );
            }
        }
    }
} 