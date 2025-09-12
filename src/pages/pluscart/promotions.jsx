import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Megaphone, Plus, Trash2, Edit, Eye, EyeOff, Tag, Calendar, Clock, Package, ArrowUpDown, Percent, Upload, X, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const Promotions = () => {
  const dispatch = useDispatch();
  const promotions = [];
  const status = "";
  const stats = "";

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "flash_sale",
    isActive: true,
    discount: 0,
    products: [],
    banner: null,
    bannerPreview: "",
    startDate: "",
    endDate: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {}, [dispatch]);

  // Filter promotions based on search term and filter
  const filteredPromotions = promotions.filter((promotion) => {
    // Search term filter
    const matchesSearch = promotion.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesFilter = true;
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (filter === "active") {
      matchesFilter = promotion.isActive && startDate <= now && endDate > now;
    } else if (filter === "upcoming") {
      matchesFilter = promotion.isActive && startDate > now;
    } else if (filter === "expired") {
      matchesFilter = endDate < now;
    }

    return matchesSearch && matchesFilter;
  });

  const handleAddNew = () => {
    setFormData({
      title: "",
      description: "",
      type: "flash_sale",
      isActive: true,
      discount: 0,
      products: [],
      banner: null,
      bannerPreview: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
    setIsEdit(false);
    setFormOpen(true);
  };

  const handleEdit = (promotion) => {
    setFormData({
      title: promotion.title,
      description: promotion.description || "",
      type: promotion.type || "flash_sale",
      isActive: promotion.isActive,
      discount: promotion.discount || 0,
      products: promotion.products || [],
      banner: null,
      bannerPreview: promotion.banner || "",
      startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
      endDate: new Date(promotion.endDate).toISOString().slice(0, 16),
    });
    setSelectedPromotion(promotion);
    setIsEdit(true);
    setFormOpen(true);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        banner: file,
        bannerPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked) => {
    setFormData({
      ...formData,
      isActive: checked,
    });
  };

  const handleTypeChange = (value) => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert("Promotion title is required");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert("Start and end dates are required");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("End date must be after start date");
      return;
    }

    const promotionData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      isActive: formData.isActive,
      discount: parseFloat(formData.discount),
      products: formData.products,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    if (formData.banner) {
      promotionData.banner = formData.bannerPreview; // In a real app, you'd upload the banner
    }

    if (isEdit) {
      dispatch(updatePromotion({ id: selectedPromotion.id, promotionData }))
        .unwrap()
        .then(() => {
          setFormOpen(false);
        })
        .catch((error) => {
          console.error("Failed to update promotion:", error);
        });
    } else {
      dispatch(createPromotion(promotionData))
        .unwrap()
        .then(() => {
          setFormOpen(false);
        })
        .catch((error) => {
          console.error("Failed to create promotion:", error);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      dispatch(deletePromotion(id));
    }
  };

  const handleToggleStatus = (id, isActive) => {
    dispatch(updatePromotionStatus({ id, isActive: !isActive }));
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper to calculate remaining time
  const getRemainingTime = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);

    if (now > end) return "Expired";

    const diffMs = end - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHrs}h remaining`;
    } else {
      return `${diffHrs}h ${diffMins}m remaining`;
    }
  };

  // Calculate status badge
  const getStatusBadge = (promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">Inactive</span>;
    } else if (startDate > now) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Scheduled</span>;
    } else if (endDate < now) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Expired</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>;
    }
  };

  // Get promotion type display
  const getPromotionTypeDisplay = (type) => {
    switch (type) {
      case "flash_sale":
        return (
          <span className="flex items-center">
            <Clock size={14} className="mr-1" /> Flash Sale
          </span>
        );
      case "special_offer":
        return (
          <span className="flex items-center">
            <Tag size={14} className="mr-1" /> Special Offer
          </span>
        );
      case "discount":
        return (
          <span className="flex items-center">
            <Percent size={14} className="mr-1" /> Discount
          </span>
        );
      default:
        return type;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Promotion Management</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add New Promotion</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Promotions</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Megaphone size={20} className="text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Promotions</p>
                <h3 className="text-2xl font-bold">{stats.active}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Eye size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <h3 className="text-2xl font-bold">{stats.upcoming}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <h3 className="text-2xl font-bold">{stats.expired}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-96">
          <Input placeholder="Search promotions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <Tabs defaultValue="all" className="w-full sm:w-auto" value={filter} onValueChange={setFilter}>
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Promotions List */}
      <div className="space-y-6">
        {status === "loading" ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredPromotions.length > 0 ? (
          filteredPromotions.map((promotion) => (
            <Card key={promotion.id} className="overflow-hidden">
              <div className="md:flex">
                {promotion.banner && (
                  <div className="w-full md:w-64 h-40 md:h-auto bg-gray-100 flex-shrink-0">
                    <img src={promotion.banner} alt={promotion.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{promotion.title}</h3>
                        {getStatusBadge(promotion)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{getPromotionTypeDisplay(promotion.type)}</div>
                    </div>
                    <div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleToggleStatus(promotion.id, promotion.isActive)}>
                          {promotion.isActive ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                          {promotion.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(promotion)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(promotion.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{promotion.description || "No description available."}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Discount</p>
                      <p className="font-medium text-green-600">{promotion.discount}% Off</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Products</p>
                      <p className="font-medium">{promotion.products?.length || 0} items</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="font-medium">{formatDate(promotion.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <div className="font-medium flex items-center">
                        {/* <span>{formatDate(promotion.endDate)}</span> */}
                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{getRemainingTime(promotion.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No promotions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No results matching "${searchTerm}". Try a different search.` : "Get started by creating a new promotion."}
            </p>
            <div className="mt-6">
              <Button onClick={handleAddNew}>
                <Plus size={16} className="mr-2" />
                Add New Promotion
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
            <DialogDescription>{isEdit ? "Make changes to the existing promotion." : "Add a new promotion to attract customers."}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Promotion Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="E.g., Summer Health Sale"
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the promotion..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="type">Promotion Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select promotion type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flash_sale">Flash Sale</SelectItem>
                    <SelectItem value="special_offer">Special Offer</SelectItem>
                    <SelectItem value="discount">Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className={formErrors.discount ? "border-red-500" : ""}
                />
                {formErrors.discount && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {formErrors.discount}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active Status</Label>
                  <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.isActive ? "This promotion will be visible to customers." : "This promotion will be hidden from customers."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="banner">Promotion Banner</Label>
                <div className="mt-1 flex items-center">
                  <input id="banner" name="banner" type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("banner").click()} className="w-full">
                    <Upload size={16} className="mr-2" />
                    {formData.banner ? "Change Banner" : "Upload Banner"}
                  </Button>
                </div>
                {formErrors.banner && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {formErrors.banner}
                  </p>
                )}
                {formData.bannerPreview && (
                  <div className="mt-2 relative rounded overflow-hidden">
                    <img src={formData.bannerPreview} alt="Banner preview" className="w-full h-32 object-cover" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full p-1 h-auto"
                      onClick={() => setFormData({ ...formData, banner: null, bannerPreview: "" })}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={formErrors.startDate ? "border-red-500" : ""}
                />
                {formErrors.startDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {formErrors.startDate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={formErrors.endDate ? "border-red-500" : ""}
                />
                {formErrors.endDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {formErrors.endDate}
                  </p>
                )}
              </div>

              <div>
                <Label>Products (Mock)</Label>
                <p className="text-sm text-gray-500 mt-1">In a real app, you would add a product selector here.</p>
                <div className="mt-2 p-4 border rounded bg-gray-50">
                  <div className="flex items-center text-sm text-gray-500">
                    <Package size={16} className="mr-2" />
                    <span>{formData.products?.length || 0} products selected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-0 border-r-0 rounded-full"></span>
                  {isEdit ? "Saving..." : "Creating..."}
                </span>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Promotion"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Promotions;
