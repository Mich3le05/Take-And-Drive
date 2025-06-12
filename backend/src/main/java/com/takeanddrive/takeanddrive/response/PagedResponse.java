package com.takeanddrive.takeanddrive.response;

import java.util.List;

public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        int totalPages,
        long totalElements
) {}
