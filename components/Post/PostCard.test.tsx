import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from './PostCard';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    title: 'Help Local Food Bank',
    organization: 'Community Helpers',
    location: 'San Francisco, CA',
    category: 'Food Security',
    description: 'Join us in helping sort and distribute food to those in need.',
    imageUrl: ['https://example.com/image.jpg'],
    currentVolunteers: 5,
    requiredVolunteers: 10,
  };

  it('renders all post information correctly', () => {
    render(<PostCard opp={mockPost} />);

    // Check if all the main elements are rendered
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.organization)).toBeInTheDocument();
    expect(screen.getByText(mockPost.location)).toBeInTheDocument();
    expect(screen.getByText(mockPost.category)).toBeInTheDocument();
    expect(screen.getByText(mockPost.description)).toBeInTheDocument();
    expect(screen.getByText('5/10 Volunteers')).toBeInTheDocument();
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
  });

  it('renders the image when imageUrl is provided', () => {
    render(<PostCard opp={mockPost} />);
    const image = screen.getByAltText(mockPost.title) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('example.com/image.jpg');
  });

  it('does not render image when imageUrl is empty', () => {
    const postWithoutImage = {
      ...mockPost,
      imageUrl: [],
    };
    render(<PostCard opp={postWithoutImage} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the correct link for the title', () => {
    render(<PostCard opp={mockPost} />);
    const link = screen.getByText(mockPost.title).closest('a');
    expect(link).toHaveAttribute('href', `/tasks/${mockPost.id}`);
  });

  it('renders the correct volunteer count', () => {
    const postWithDifferentCounts = {
      ...mockPost,
      currentVolunteers: 3,
      requiredVolunteers: 8,
    };
    render(<PostCard opp={postWithDifferentCounts} />);
    expect(screen.getByText('3/8 Volunteers')).toBeInTheDocument();
  });
});