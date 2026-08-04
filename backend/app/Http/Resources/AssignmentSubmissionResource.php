<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'assessment_id' =>
                $this->assessment_id,

            'student_id' =>
                $this->student_id,

            'submission_file' =>
                $this->submission_file,

            'submission_file_url' =>
                $this->submission_file
                    ? asset(
                        'storage/' .
                        ltrim(
                            $this->submission_file,
                            '/'
                        )
                    )
                    : null,

            'submitted_at' =>
                $this->submitted_at
                    ?->toISOString(),

            'marks' => $this->marks,

            'feedback' => $this->feedback,

            'status' => $this->status,

            'assessment' => $this->whenLoaded( 'assessment',function () {
                    return [
                        'id' =>
                            $this->assessment->id,

                        'title' =>
                            $this->assessment->title,

                        'type' =>
                            $this->assessment->type,

                        'total_marks' =>
                            $this->assessment
                                ->total_marks,

                        'due_date' =>
                            $this->assessment
                                ->due_date
                                ?->toISOString(),

                        'subject' =>
                            $this->assessment
                                ->relationLoaded(
                                    'subject'
                                )
                                ? [
                                    'id' =>
                                        $this->assessment
                                            ->subject
                                            ->id,

                                    'subject_code' =>
                                        $this->assessment
                                            ->subject
                                            ->subject_code,

                                    'subject_name' =>
                                        $this->assessment
                                            ->subject
                                            ->subject_name,
                                ]
                                : null,
                    ];
                }
            ),

            'student' => $this->whenLoaded( 'student',function () {
                    return [
                        'id' =>
                            $this->student->id,

                        'student_number' =>
                            $this->student
                                ->student_number,

                        'first_name' =>
                            $this->student
                                ->first_name,

                        'last_name' =>
                            $this->student
                                ->last_name,

                        'full_name' => trim(
                            $this->student
                                ->first_name
                            . ' '
                            . $this->student
                                ->last_name
                        ),

                        'email' =>
                            $this->student->email,

                        'course' =>
                            $this->student->course,
                    ];
                }
            ),

            'created_at' =>
                $this->created_at
                    ?->toISOString(),

            'updated_at' =>
                $this->updated_at
                    ?->toISOString(),
        ];
    }
}